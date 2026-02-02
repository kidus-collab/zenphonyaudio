export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  company: string | null
  job_title: string | null
  subscription_plan: 'free' | 'economy' | 'pro' | 'master'
  subscription_status: 'active' | 'cancelled' | 'past_due'
  subscription_period: string | null
  listening_minutes_used: number
  listening_minutes_limit: number
  extra_minutes: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface UsageDailySnapshot {
  id: string
  user_id: string
  date: string
  minutes_used: number
  cumulative_used: number
  minutes_limit: number
  subscription_plan: string
  created_at: string
}

export interface BillingEvent {
  id: string
  user_id: string
  event_type: string
  amount_cents: number
  plan_from: string | null
  plan_to: string | null
  stripe_event_id: string | null
  description: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
      }
      usage_daily_snapshots: {
        Row: UsageDailySnapshot
        Insert: Omit<UsageDailySnapshot, 'id' | 'created_at'>
        Update: Partial<UsageDailySnapshot>
      }
      billing_events: {
        Row: BillingEvent
        Insert: Omit<BillingEvent, 'id' | 'created_at'>
        Update: Partial<BillingEvent>
      }
    }
  }
}
