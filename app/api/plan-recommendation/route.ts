import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateRecommendation, type PlanId } from '@/lib/plan-recommendation'

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()

    const currentPlan = (profile?.subscription_plan || 'free') as PlanId

    // Fetch 90 days of usage data
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const { data: usageData } = await supabase
      .from('usage_daily_snapshots')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', ninetyDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true })

    // Fetch top-up spending in same period
    const { data: billingEvents } = await supabase
      .from('billing_events')
      .select('amount_cents, event_type')
      .eq('user_id', user.id)
      .eq('event_type', 'topup_purchased')
      .gte('created_at', ninetyDaysAgo.toISOString())

    const topUpSpending = (billingEvents || []).reduce((sum, e) => sum + e.amount_cents, 0)

    const recommendation = calculateRecommendation(
      currentPlan,
      usageData || [],
      topUpSpending
    )

    return NextResponse.json(recommendation)
  } catch (error: any) {
    console.error('Plan recommendation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
