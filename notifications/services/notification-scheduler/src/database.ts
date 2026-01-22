import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface PushSubscription {
  id: string;
  user_id: string;
  type: 'web' | 'expo' | 'fcm';
  token: string | null;
  subscription: Record<string, unknown> | null;
  device_name: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

let supabase: SupabaseClient | null = null;

/**
 * Initialize Supabase client
 */
function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }

    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabase;
}

/**
 * Get all active push subscriptions from the database
 */
export async function getActiveSubscriptions(): Promise<PushSubscription[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('push_subscriptions')
    .select('*')
    .eq('enabled', true);

  if (error) {
    console.error('[Database] Error fetching subscriptions:', error);
    return [];
  }

  return data || [];
}

/**
 * Get subscriptions for a specific user
 */
export async function getUserSubscriptions(userId: string): Promise<PushSubscription[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('enabled', true);

  if (error) {
    console.error('[Database] Error fetching user subscriptions:', error);
    return [];
  }

  return data || [];
}

/**
 * Remove an invalid subscription
 */
export async function removeSubscription(subscriptionId: string): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client
    .from('push_subscriptions')
    .delete()
    .eq('id', subscriptionId);

  if (error) {
    console.error('[Database] Error removing subscription:', error);
  } else {
    console.log(`[Database] Removed invalid subscription: ${subscriptionId}`);
  }
}

/**
 * Disable a subscription (soft delete)
 */
export async function disableSubscription(subscriptionId: string): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client
    .from('push_subscriptions')
    .update({ enabled: false, updated_at: new Date().toISOString() })
    .eq('id', subscriptionId);

  if (error) {
    console.error('[Database] Error disabling subscription:', error);
  } else {
    console.log(`[Database] Disabled subscription: ${subscriptionId}`);
  }
}

/**
 * Log a sent notification
 */
export async function logNotificationSent(
  reminderId: string,
  recipientCount: number
): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client.from('notification_logs').insert({
    reminder_id: reminderId,
    recipient_count: recipientCount,
    sent_at: new Date().toISOString(),
  });

  if (error) {
    // Table might not exist yet, just log to console
    console.log(`[Database] Logged: ${reminderId} sent to ${recipientCount} recipients`);
  }
}

/**
 * Get subscription count by type
 */
export async function getSubscriptionStats(): Promise<Record<string, number>> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('push_subscriptions')
    .select('type')
    .eq('enabled', true);

  if (error) {
    console.error('[Database] Error fetching stats:', error);
    return { web: 0, expo: 0, fcm: 0 };
  }

  const stats: Record<string, number> = { web: 0, expo: 0, fcm: 0 };
  data?.forEach((sub) => {
    stats[sub.type] = (stats[sub.type] || 0) + 1;
  });

  return stats;
}
