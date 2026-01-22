import webPush from 'web-push';
import { removeSubscription } from '../database.js';

interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, unknown>;
}

interface Subscription {
  id: string;
  subscription: Record<string, unknown> | null;
}

interface SendResult {
  sent: number;
  failed: number;
}

// Initialize web-push with VAPID keys
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:hello@zenphony.audio';

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
  console.log('[Web Push] VAPID keys configured');
} else {
  console.warn('[Web Push] VAPID keys not configured - web push disabled');
}

/**
 * Send web push notifications to all subscribed browsers
 */
export async function sendWebPushNotifications(
  subscriptions: Subscription[],
  payload: NotificationPayload
): Promise<SendResult> {
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn('[Web Push] Skipping - VAPID keys not configured');
    return { sent: 0, failed: 0 };
  }

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      if (!sub.subscription) {
        return { success: false, id: sub.id, reason: 'no subscription data' };
      }

      try {
        await webPush.sendNotification(
          sub.subscription as webPush.PushSubscription,
          JSON.stringify(payload),
          {
            TTL: 60 * 60, // 1 hour
            urgency: 'high',
          }
        );
        return { success: true, id: sub.id };
      } catch (error: any) {
        // Handle expired/invalid subscriptions
        if (error.statusCode === 404 || error.statusCode === 410) {
          await removeSubscription(sub.id);
          return { success: false, id: sub.id, reason: 'subscription expired' };
        }
        return { success: false, id: sub.id, reason: error.message };
      }
    })
  );

  const sent = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length;
  const failed = results.length - sent;

  return { sent, failed };
}

/**
 * Generate VAPID keys (run once during setup)
 */
export function generateVapidKeys(): { publicKey: string; privateKey: string } {
  const keys = webPush.generateVAPIDKeys();
  console.log('\n=== VAPID Keys Generated ===');
  console.log('Add these to your .env file:\n');
  console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
  console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
  console.log('============================\n');
  return keys;
}
