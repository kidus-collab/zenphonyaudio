import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null

// Plan pricing configuration
const plans: Record<string, {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  minutes: number
}> = {
  free: { name: 'Free', monthlyPrice: 0, yearlyPrice: 0, minutes: 5 },
  basic: { name: 'Basic', monthlyPrice: 7.99, yearlyPrice: 85, minutes: 30 },
  pro: { name: 'Pro', monthlyPrice: 29.99, yearlyPrice: 320, minutes: 120 },
  max: { name: 'Max', monthlyPrice: 69.99, yearlyPrice: 830, minutes: 350 },
}

// Top-up pricing configuration
const topUps: Record<string, {
  name: string
  price: number
  minutes: number
}> = {
  small: { name: 'Small Top-up', price: 4.99, minutes: 20 },
  medium: { name: 'Medium Top-up', price: 9.99, minutes: 45 },
  large: { name: 'Large Top-up', price: 19.99, minutes: 80 },
}

// Get Stripe price ID from environment
function getPriceId(planId: string, billingPeriod: 'monthly' | 'yearly'): string | null {
  const periodSuffix = billingPeriod.toUpperCase()
  const planUpper = planId.toUpperCase()
  const envKey = `STRIPE_PRICE_${planUpper}_${periodSuffix}`
  return process.env[envKey] || null
}

function getTopUpPriceId(topUpId: string): string | null {
  const topUpUpper = topUpId.toUpperCase()
  const envKey = `STRIPE_PRICE_TOPUP_${topUpUpper}`
  return process.env[envKey] || null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, topUpId, billingPeriod = 'monthly', email } = body

    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 503 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zenphonyaudio.vercel.app'

    // Handle top-up purchase (one-time payment)
    if (topUpId) {
      const topUp = topUps[topUpId]
      if (!topUp) {
        return NextResponse.json(
          { error: 'Invalid top-up selected' },
          { status: 400 }
        )
      }

      const priceId = getTopUpPriceId(topUpId)

      // If no price ID configured, create a price on the fly (for testing)
      if (!priceId || priceId.startsWith('price_topup_')) {
        // Create a one-time price dynamically
        const session = await stripe.checkout.sessions.create({
          // Let Stripe automatically show all available payment methods
          // This includes: Card, PayPal, Apple Pay, Google Pay, Bank transfers, etc.
          payment_method_types: undefined, // Let Stripe decide based on your account settings
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Listen Buddy - ${topUp.name}`,
                  description: `${topUp.minutes} extra analysis minutes`,
                },
                unit_amount: Math.round(topUp.price * 100), // Convert to cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=topup`,
          cancel_url: `${baseUrl}/products/listen-buddy#pricing`,
          customer_email: email || undefined,
          metadata: {
            type: 'topup',
            topUpId: topUpId,
            minutes: topUp.minutes.toString(),
          },
          allow_promotion_codes: true,
          // Enable automatic payment methods (PayPal, bank, etc.)
          payment_method_options: {
            card: {
              setup_future_usage: 'off_session',
            },
          },
        })

        return NextResponse.json({ url: session.url })
      }

      // Use existing price ID
      const session = await stripe.checkout.sessions.create({
        payment_method_types: undefined, // Let Stripe decide
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=topup`,
        cancel_url: `${baseUrl}/products/listen-buddy#pricing`,
        customer_email: email || undefined,
        metadata: {
          type: 'topup',
          topUpId: topUpId,
          minutes: topUp.minutes.toString(),
        },
        allow_promotion_codes: true,
      })

      return NextResponse.json({ url: session.url })
    }

    // Handle subscription purchase
    if (!planId || !plans[planId]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    const plan = plans[planId]

    // For free plan, redirect directly to signup
    if (plan.monthlyPrice === 0) {
      return NextResponse.json({
        url: '/signup?plan=free',
      })
    }

    const priceId = getPriceId(planId, billingPeriod)
    const displayPrice = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice

    // If no price ID configured, create a price on the fly (for testing)
    if (!priceId || priceId.startsWith('price_')) {
      const session = await stripe.checkout.sessions.create({
        // Let Stripe automatically show available payment methods
        // For subscriptions: Card, PayPal (if enabled), SEPA, etc.
        payment_method_types: undefined,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Listen Buddy - ${plan.name} Plan`,
                description: `${plan.minutes} analysis minutes per month`,
              },
              unit_amount: Math.round(displayPrice * 100), // Convert to cents
              recurring: {
                interval: billingPeriod === 'monthly' ? 'month' : 'year',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
        cancel_url: `${baseUrl}/products/listen-buddy#pricing`,
        customer_email: email || undefined,
        metadata: {
          type: 'subscription',
          planId: planId,
          billingPeriod: billingPeriod,
          minutes: plan.minutes.toString(),
        },
        allow_promotion_codes: true,
      })

      return NextResponse.json({ url: session.url })
    }

    // Use existing price ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: undefined, // Let Stripe decide
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
      cancel_url: `${baseUrl}/products/listen-buddy#pricing`,
      customer_email: email || undefined,
      metadata: {
        type: 'subscription',
        planId: planId,
        billingPeriod: billingPeriod,
        minutes: plan.minutes.toString(),
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
