import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

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

    // Check for existing billing events
    const { data: events, error: eventsError } = await supabase
      .from('billing_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (eventsError) {
      console.error('Error fetching billing events:', eventsError)
      return NextResponse.json({ error: 'Failed to fetch billing history' }, { status: 500 })
    }

    // If no events exist and user has a stripe_customer_id, backfill from Stripe invoices
    if ((!events || events.length === 0) && stripe) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single()

      if (profile?.stripe_customer_id) {
        try {
          const invoices = await stripe.invoices.list({
            customer: profile.stripe_customer_id,
            limit: 50,
          })

          if (invoices.data.length > 0) {
            const adminSupabase = createAdminClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!
            )

            const backfillEvents = invoices.data
              .filter(inv => inv.status === 'paid')
              .map(inv => ({
                user_id: user.id,
                event_type: 'invoice_paid' as const,
                amount_cents: inv.amount_paid,
                plan_from: null,
                plan_to: null,
                stripe_event_id: `invoice_${inv.id}`,
                description: inv.lines.data[0]?.description || `Invoice ${inv.number}`,
              }))

            if (backfillEvents.length > 0) {
              // Use upsert to avoid duplicates on stripe_event_id
              await adminSupabase
                .from('billing_events')
                .upsert(backfillEvents, { onConflict: 'stripe_event_id' })

              // Re-fetch after backfill
              const { data: refreshed } = await supabase
                .from('billing_events')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50)

              return NextResponse.json({ data: refreshed || [] })
            }
          }
        } catch (err) {
          console.error('Error backfilling from Stripe:', err)
        }
      }
    }

    return NextResponse.json({ data: events || [] })
  } catch (error: any) {
    console.error('Billing history error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
