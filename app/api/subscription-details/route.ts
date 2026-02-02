import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id, subscription_plan, subscription_status')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // If no Stripe data or free plan, return minimal info
    if (!stripe || !profile.stripe_subscription_id || profile.subscription_plan === 'free') {
      return NextResponse.json({
        subscription: null,
        paymentMethod: null,
      })
    }

    // Fetch subscription from Stripe
    let subscription = null
    try {
      const stripeSub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id)
      const item = stripeSub.items.data[0]
      const price = item?.price

      subscription = {
        plan: profile.subscription_plan,
        status: stripeSub.status,
        amount: price ? price.unit_amount! / 100 : 0,
        interval: price?.recurring?.interval || 'month',
        currentPeriodEnd: stripeSub.current_period_end,
        nextBillingDate: new Date(stripeSub.current_period_end * 1000).toISOString(),
      }
    } catch (err) {
      console.error('Error fetching Stripe subscription:', err)
    }

    // Fetch payment method from Stripe
    let paymentMethod = null
    if (profile.stripe_customer_id) {
      try {
        const customer = await stripe.customers.retrieve(profile.stripe_customer_id, {
          expand: ['invoice_settings.default_payment_method'],
        }) as Stripe.Customer

        const defaultPM = customer.invoice_settings?.default_payment_method as Stripe.PaymentMethod | null

        if (defaultPM?.card) {
          paymentMethod = {
            brand: defaultPM.card.brand,
            last4: defaultPM.card.last4,
            expMonth: defaultPM.card.exp_month,
            expYear: defaultPM.card.exp_year,
          }
        } else if (customer.default_source) {
          // Fallback to default_source (legacy cards)
          const source = typeof customer.default_source === 'string'
            ? await stripe.customers.retrieveSource(profile.stripe_customer_id, customer.default_source)
            : customer.default_source

          if (source && 'brand' in source && 'last4' in source) {
            paymentMethod = {
              brand: (source as any).brand,
              last4: (source as any).last4,
              expMonth: (source as any).exp_month,
              expYear: (source as any).exp_year,
            }
          }
        }
      } catch (err) {
        console.error('Error fetching payment method:', err)
      }
    }

    return NextResponse.json({ subscription, paymentMethod })
  } catch (error: any) {
    console.error('Subscription details error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscription details' },
      { status: 500 }
    )
  }
}
