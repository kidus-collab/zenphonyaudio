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
  listening_minutes_used: number
  listening_minutes_limit: number
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
      }
    }
  }
}
