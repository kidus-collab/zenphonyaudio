-- Create push_subscriptions table for storing push notification subscriptions
-- Supports Web Push, Expo, and Firebase Cloud Messaging (FCM)

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Subscription type: 'web' (Web Push), 'expo' (Expo Push), 'fcm' (Firebase)
  type TEXT NOT NULL CHECK (type IN ('web', 'expo', 'fcm')),

  -- Token for Expo/FCM push notifications
  token TEXT,

  -- Full subscription object for Web Push (includes endpoint and keys)
  subscription JSONB,

  -- Device identifier for user reference
  device_name TEXT,

  -- Whether this subscription is active
  enabled BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate subscriptions
  CONSTRAINT unique_subscription UNIQUE (user_id, type, token),
  CONSTRAINT unique_web_subscription UNIQUE ((subscription->>'endpoint'))
);

-- Create index for faster lookups
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_type ON push_subscriptions(type);
CREATE INDEX idx_push_subscriptions_enabled ON push_subscriptions(enabled);

-- Enable Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
  ON push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
  ON push_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own subscriptions
CREATE POLICY "Users can delete own subscriptions"
  ON push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Service role can access all subscriptions (for backend scheduler)
CREATE POLICY "Service role full access"
  ON push_subscriptions
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Create notification_logs table for tracking sent notifications
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reminder_id TEXT NOT NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT NOW(),

  -- Optional: Track success/failure counts
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,

  -- Optional: Store error details
  errors JSONB
);

-- Create index for querying logs
CREATE INDEX idx_notification_logs_reminder_id ON notification_logs(reminder_id);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on push_subscriptions
CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE push_subscriptions IS 'Stores push notification subscriptions for web, mobile (Expo), and FCM';
COMMENT ON TABLE notification_logs IS 'Tracks sent notifications for analytics and debugging';
