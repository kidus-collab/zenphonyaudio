-- Usage daily snapshots table
create table if not exists public.usage_daily_snapshots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  minutes_used numeric not null default 0,
  cumulative_used numeric not null default 0,
  minutes_limit numeric not null default 0,
  subscription_plan text not null default 'free',
  created_at timestamptz default now()
);

-- Unique constraint on user_id + date
create unique index if not exists idx_usage_snapshots_user_date
  on public.usage_daily_snapshots (user_id, date);

-- Index for querying by user
create index if not exists idx_usage_snapshots_user_id
  on public.usage_daily_snapshots (user_id);

-- RLS
alter table public.usage_daily_snapshots enable row level security;

create policy "Users can read own usage snapshots"
  on public.usage_daily_snapshots for select
  using (auth.uid() = user_id);

-- Billing events table
create table if not exists public.billing_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  event_type text not null, -- 'subscription_created', 'subscription_updated', 'subscription_cancelled', 'payment_failed', 'topup_purchased', 'invoice_paid'
  amount_cents integer not null default 0,
  plan_from text,
  plan_to text,
  stripe_event_id text,
  description text,
  created_at timestamptz default now()
);

-- Index for querying by user
create index if not exists idx_billing_events_user_id
  on public.billing_events (user_id);

-- Unique on stripe_event_id to prevent duplicates
create unique index if not exists idx_billing_events_stripe_event
  on public.billing_events (stripe_event_id)
  where stripe_event_id is not null;

-- RLS
alter table public.billing_events enable row level security;

create policy "Users can read own billing events"
  on public.billing_events for select
  using (auth.uid() = user_id);

-- Trigger function: auto-snapshot when listening_minutes_used changes
create or replace function public.on_profile_usage_changed()
returns trigger as $$
begin
  if OLD.listening_minutes_used is distinct from NEW.listening_minutes_used then
    insert into public.usage_daily_snapshots (
      user_id, date, minutes_used, cumulative_used, minutes_limit, subscription_plan
    ) values (
      NEW.id,
      current_date,
      NEW.listening_minutes_used - coalesce(OLD.listening_minutes_used, 0),
      NEW.listening_minutes_used,
      NEW.listening_minutes_limit,
      NEW.subscription_plan
    )
    on conflict (user_id, date)
    do update set
      minutes_used = usage_daily_snapshots.minutes_used + (NEW.listening_minutes_used - OLD.listening_minutes_used),
      cumulative_used = NEW.listening_minutes_used,
      minutes_limit = NEW.listening_minutes_limit,
      subscription_plan = NEW.subscription_plan;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Attach trigger to profiles table
drop trigger if exists trigger_profile_usage_changed on public.profiles;
create trigger trigger_profile_usage_changed
  after update on public.profiles
  for each row
  execute function public.on_profile_usage_changed();
