import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const body = await request.text()
  const signature = headers().get('stripe-signature')!

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

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Get customer email from metadata
      const email = session.customer_email || session.customer_details?.email
      const planId = session.metadata?.planId

      console.log('Checkout session completed:', { email, planId, sessionId: session.id })

      if (!email || !planId) {
        console.error('Missing email or planId in session metadata')
        break
      }

      // Find or create user
      const { data: { user: existingUser } } = await supabase.auth.admin.listUsers()
      const user = existingUser.find(u => u.email === email)

      if (!user) {
        console.error('User not found for email:', email)
        break
      }

      // Update user profile with subscription info
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_plan: planId,
          subscription_status: 'active',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
      } else {
        console.log('Successfully updated subscription for user:', user.id)
      }

      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      // Get customer ID to find user
      const customerId = subscription.customer as string

      // Find user by stripe_customer_id
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profiles) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: event.type === 'customer.subscription.deleted' ? 'cancelled' : 'active',
            subscription_plan: event.type === 'customer.subscription.deleted' ? 'free' : subscription.metadata?.planId || 'free',
          })
          .eq('id', profiles.id)

        if (updateError) {
          console.error('Error updating subscription status:', updateError)
        } else {
          console.log('Successfully updated subscription status for user:', profiles.id)
        }
      }

      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
