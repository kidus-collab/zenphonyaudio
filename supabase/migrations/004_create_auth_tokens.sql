-- Create auth_tokens table for cross-platform authentication
-- Used to authenticate the DAW plugin via magic link from website

CREATE TABLE public.auth_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster token lookups
CREATE INDEX idx_auth_tokens_token ON public.auth_tokens(token);
CREATE INDEX idx_auth_tokens_user_id ON public.auth_tokens(user_id);

-- Enable Row Level Security
ALTER TABLE public.auth_tokens ENABLE ROW LEVEL SECURITY;

-- Users can view their own tokens
CREATE POLICY "Users can view own tokens"
  ON public.auth_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create tokens for themselves
CREATE POLICY "Users can create own tokens"
  ON public.auth_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own tokens (mark as used)
CREATE POLICY "Users can update own tokens"
  ON public.auth_tokens
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own tokens
CREATE POLICY "Users can delete own tokens"
  ON public.auth_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can do everything (for API endpoints)
CREATE POLICY "Service role full access"
  ON public.auth_tokens
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to clean up expired tokens (can be called by cron job)
CREATE OR REPLACE FUNCTION public.cleanup_expired_auth_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.auth_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
