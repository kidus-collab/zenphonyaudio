import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    let daysBack: number
    switch (range) {
      case '90d':
        daysBack = 90
        break
      case '12m':
        daysBack = 365
        break
      case '30d':
      default:
        daysBack = 30
        break
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('usage_daily_snapshots')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDateStr)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching usage history:', error)
      return NextResponse.json({ error: 'Failed to fetch usage history' }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error: any) {
    console.error('Usage history error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
