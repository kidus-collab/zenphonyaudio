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

// This endpoint verifies a checkout session and updates the user's profile
// Used as a fallback when webhooks can't reach localhost
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const email = session.customer_email || session.customer_details?.email
    const metadata = session.metadata || {}
    const type = metadata.type // 'subscription' or 'topup'

    if (!email) {
      return NextResponse.json({ error: 'No email found in session' }, { status: 400 })
    }

    // Find user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('Error listing users:', listError)
      return NextResponse.json({ error: 'Failed to find user' }, { status: 500 })
    }

    const user = users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (type === 'topup') {
      // Handle top-up purchase
      const minutes = parseInt(metadata.minutes || '0', 10)

      // Get current profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('topup_minutes')
        .eq('id', user.id)
        .single()

      const currentMinutes = profile?.topup_minutes || 0
      const newMinutes = currentMinutes + minutes

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          topup_minutes: newMinutes,
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        type: 'topup',
        minutes: minutes,
        totalMinutes: newMinutes
      })

    } else {
      // Handle subscription purchase
      const planId = metadata.planId
      const billingPeriod = metadata.billingPeriod || 'monthly'
      const minutes = parseInt(metadata.minutes || '0', 10)

      // Map plan to minutes limit
      const minutesMap: Record<string, number> = {
        free: 5,
        basic: 30,
        pro: 120,
        max: 350,
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_plan: planId,
          subscription_status: 'active',
          subscription_period: billingPeriod,
          listening_minutes_limit: minutesMap[planId] || 5,
          listening_minutes_used: 0, // Reset usage on new subscription
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        type: 'subscription',
        plan: planId,
        billingPeriod: billingPeriod
      })
    }

  } catch (error: any) {
    console.error('Verify checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify checkout' },
      { status: 500 }
    )
  }
}
