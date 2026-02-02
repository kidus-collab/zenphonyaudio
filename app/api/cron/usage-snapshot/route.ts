import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  // Verify cron secret for Vercel
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch all active profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, listening_minutes_used, listening_minutes_limit, subscription_plan')
      .in('subscription_status', ['active'])

    if (error) {
      console.error('Error fetching profiles:', error)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    const today = new Date().toISOString().split('T')[0]
    let inserted = 0
    let skipped = 0

    for (const profile of profiles || []) {
      const { error: upsertError } = await supabase
        .from('usage_daily_snapshots')
        .upsert(
          {
            user_id: profile.id,
            date: today,
            minutes_used: 0, // Daily delta — trigger handles real-time updates
            cumulative_used: profile.listening_minutes_used || 0,
            minutes_limit: profile.listening_minutes_limit || 0,
            subscription_plan: profile.subscription_plan || 'free',
          },
          { onConflict: 'user_id,date', ignoreDuplicates: true }
        )

      if (upsertError) {
        console.error(`Error snapshotting user ${profile.id}:`, upsertError)
        skipped++
      } else {
        inserted++
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      skipped,
      total: profiles?.length || 0,
    })
  } catch (error: any) {
    console.error('Cron usage snapshot error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
