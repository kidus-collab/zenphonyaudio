import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`Received Stripe event: ${event.type}`)

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Get customer email from session
      const email = session.customer_email || session.customer_details?.email
      const metadata = session.metadata || {}
      const type = metadata.type // 'subscription' or 'topup'

      console.log('Checkout session completed:', {
        email,
        type,
        metadata,
        sessionId: session.id
      })

      if (!email) {
        console.error('Missing email in session')
        break
      }

      // Find user by email
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

      if (listError) {
        console.error('Error listing users:', listError)
        break
      }

      const user = users.find(u => u.email === email)

      if (!user) {
        console.error('User not found for email:', email)
        break
      }

      if (type === 'topup') {
        // Handle top-up purchase - add minutes to user's account
        const minutes = parseInt(metadata.minutes || '0', 10)
        const topUpId = metadata.topUpId

        console.log(`Processing top-up: ${topUpId}, ${minutes} minutes for user ${user.id}`)

        // Get current profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('extra_minutes')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          break
        }

        const currentMinutes = profile?.extra_minutes || 0
        const newMinutes = currentMinutes + minutes

        // Update user profile with extra minutes
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            extra_minutes: newMinutes,
            last_topup_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating profile with top-up:', updateError)
        } else {
          console.log(`Successfully added ${minutes} minutes to user ${user.id}. Total: ${newMinutes}`)

          // Record billing event for top-up
          await supabase.from('billing_events').upsert({
            user_id: user.id,
            event_type: 'topup_purchased',
            amount_cents: session.amount_total || 0,
            plan_from: null,
            plan_to: null,
            stripe_event_id: event.id,
            description: `Top-up: ${minutes} minutes`,
          }, { onConflict: 'stripe_event_id' }).then(({ error: beError }) => {
            if (beError) console.error('Error recording billing event:', beError)
          })
        }

      } else {
        // Handle subscription purchase
        const planId = metadata.planId
        const billingPeriod = metadata.billingPeriod || 'monthly'
        const minutes = parseInt(metadata.minutes || '0', 10)

        console.log(`Processing subscription: ${planId} (${billingPeriod}) for user ${user.id}`)

        // Update user profile with subscription info
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_plan: planId,
            subscription_period: billingPeriod,
            subscription_status: 'active',
            monthly_minutes: minutes,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_started_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating profile:', updateError)
        } else {
          console.log(`Successfully activated ${planId} subscription for user ${user.id}`)

          // Record billing event for subscription
          await supabase.from('billing_events').upsert({
            user_id: user.id,
            event_type: 'subscription_created',
            amount_cents: session.amount_total || 0,
            plan_from: 'free',
            plan_to: planId,
            stripe_event_id: event.id,
            description: `Subscribed to ${planId} plan (${billingPeriod})`,
          }, { onConflict: 'stripe_event_id' }).then(({ error: beError }) => {
            if (beError) console.error('Error recording billing event:', beError)
          })
        }
      }

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription

      // Get customer ID to find user
      const customerId = subscription.customer as string
      const status = subscription.status

      console.log(`Subscription updated for customer ${customerId}: ${status}`)

      // Find user by stripe_customer_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profileError || !profile) {
        console.error('Profile not found for customer:', customerId)
        break
      }

      // Map Stripe status to our status
      let subscriptionStatus = 'active'
      if (status === 'past_due') subscriptionStatus = 'past_due'
      if (status === 'unpaid') subscriptionStatus = 'past_due'
      if (status === 'canceled') subscriptionStatus = 'cancelled'
      if (status === 'incomplete_expired') subscriptionStatus = 'cancelled'

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_status: subscriptionStatus,
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Error updating subscription status:', updateError)
      } else {
        console.log(`Updated subscription status to ${subscriptionStatus} for user ${profile.id}`)

        // Record billing event for subscription update
        await supabase.from('billing_events').upsert({
          user_id: profile.id,
          event_type: 'subscription_updated',
          amount_cents: 0,
          plan_from: null,
          plan_to: null,
          stripe_event_id: event.id,
          description: `Subscription status changed to ${subscriptionStatus}`,
        }, { onConflict: 'stripe_event_id' }).then(({ error: beError }) => {
          if (beError) console.error('Error recording billing event:', beError)
        })
      }

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      // Get customer ID to find user
      const customerId = subscription.customer as string

      console.log(`Subscription deleted for customer ${customerId}`)

      // Find user by stripe_customer_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profileError || !profile) {
        console.error('Profile not found for customer:', customerId)
        break
      }

      // Downgrade to free plan
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'cancelled',
          subscription_plan: 'free',
          monthly_minutes: 5, // Free plan minutes
          stripe_subscription_id: null,
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Error cancelling subscription:', updateError)
      } else {
        console.log(`Subscription cancelled for user ${profile.id}, downgraded to free plan`)

        // Record billing event for cancellation
        await supabase.from('billing_events').upsert({
          user_id: profile.id,
          event_type: 'subscription_cancelled',
          amount_cents: 0,
          plan_from: null,
          plan_to: 'free',
          stripe_event_id: event.id,
          description: 'Subscription cancelled, downgraded to free plan',
        }, { onConflict: 'stripe_event_id' }).then(({ error: beError }) => {
          if (beError) console.error('Error recording billing event:', beError)
        })
      }

      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      console.log(`Payment failed for customer ${customerId}`)

      // Find user by stripe_customer_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'past_due',
          })
          .eq('id', profile.id)

        console.log(`Marked subscription as past_due for user ${profile.id}`)

        // Record billing event for payment failure
        await supabase.from('billing_events').upsert({
          user_id: profile.id,
          event_type: 'payment_failed',
          amount_cents: invoice.amount_due || 0,
          plan_from: null,
          plan_to: null,
          stripe_event_id: event.id,
          description: `Payment failed for invoice ${invoice.number || invoice.id}`,
        }, { onConflict: 'stripe_event_id' }).then(({ error: beError }) => {
          if (beError) console.error('Error recording billing event:', beError)
        })
      }

      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
