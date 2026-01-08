import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null

const prices: Record<string, { priceId: string; price: number }> = {
  free: { priceId: '', price: 0 },
  economy: { priceId: process.env.STRIPE_PRICE_ECONOMY!, price: 7.99 },
  pro: { priceId: process.env.STRIPE_PRICE_PRO!, price: 25.00 },
  master: { priceId: process.env.STRIPE_PRICE_MASTER!, price: 55.00 },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId } = body

    // Validate plan ID
    if (!planId || !prices[planId]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    const plan = prices[planId]

    // For free plan, redirect directly to signup
    if (plan.price === 0) {
      return NextResponse.json({
        url: '/signup',
      })
    }

    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured' },
        { status: 503 }
      )
    }

    // Create Stripe checkout session for paid plans
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/products/listen-buddy#pricing`,
      customer_email: body.email || undefined,
      metadata: {
        planId: planId,
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
