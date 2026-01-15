-- Add topup_minutes balance column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS topup_minutes INTEGER DEFAULT 0;

-- Add subscription_period for monthly/yearly billing
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_period TEXT DEFAULT 'monthly';

-- Add API key for DAW plugin authentication
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS api_key TEXT UNIQUE;

-- Add Stripe customer and subscription IDs if not exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Create topup_purchases table for purchase history
CREATE TABLE IF NOT EXISTS public.topup_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  topup_type TEXT NOT NULL, -- 'small', 'medium', 'large'
  minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on topup_purchases
ALTER TABLE public.topup_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchase history
CREATE POLICY "Users can view own topup purchases"
  ON public.topup_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert purchases (via webhook)
CREATE POLICY "Service role can insert topup purchases"
  ON public.topup_purchases
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_topup_purchases_user_id ON public.topup_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_api_key ON public.profiles(api_key);

-- Function to generate a unique API key
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT AS $$
DECLARE
  key TEXT;
  key_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random key: lb_ prefix + 32 random hex characters
    key := 'lb_' || encode(gen_random_bytes(16), 'hex');

    -- Check if key already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE api_key = key) INTO key_exists;

    -- Exit loop if key is unique
    EXIT WHEN NOT key_exists;
  END LOOP;

  RETURN key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to regenerate API key for a user
CREATE OR REPLACE FUNCTION public.regenerate_api_key(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  new_key TEXT;
BEGIN
  -- Only allow users to regenerate their own key
  IF auth.uid() != user_uuid THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Generate new key
  new_key := public.generate_api_key();

  -- Update profile
  UPDATE public.profiles
  SET api_key = new_key, updated_at = NOW()
  WHERE id = user_uuid;

  RETURN new_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy to allow reading api_key (users can only see their own)
-- This is already covered by the existing "Users can view own profile" policy

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.api_key IS 'API key for DAW plugin authentication. Format: lb_[32 hex chars]';
COMMENT ON COLUMN public.profiles.topup_minutes IS 'Available top-up minutes balance (purchased separately from subscription)';
COMMENT ON COLUMN public.profiles.subscription_period IS 'Billing period: monthly or yearly';
COMMENT ON TABLE public.topup_purchases IS 'History of top-up minute purchases';
