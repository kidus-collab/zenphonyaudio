import admin from 'firebase-admin';
import { removeSubscription } from '../database.js';

interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, unknown>;
}

interface Subscription {
  id: string;
  token: string | null;
}

interface SendResult {
  sent: number;
  failed: number;
}

// Initialize Firebase Admin
let firebaseInitialized = false;

function initFirebase(): boolean {
  if (firebaseInitialized) return true;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccount) {
    console.warn('[Firebase] Service account not configured - FCM disabled');
    return false;
  }

  try {
    const credentials = JSON.parse(serviceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
    firebaseInitialized = true;
    console.log('[Firebase] Initialized successfully');
    return true;
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
    return false;
  }
}

/**
 * Send push notifications via Firebase Cloud Messaging
 */
export async function sendFirebaseNotifications(
  subscriptions: Subscription[],
  payload: NotificationPayload
): Promise<SendResult> {
  if (!initFirebase()) {
    return { sent: 0, failed: 0 };
  }

  // Filter valid tokens
  const validSubscriptions = subscriptions.filter((sub) => sub.token);

  if (validSubscriptions.length === 0) {
    console.log('[Firebase] No valid tokens to send to');
    return { sent: 0, failed: 0 };
  }

  const tokens = validSubscriptions.map((sub) => sub.token!);

  // Create multicast message
  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data
      ? Object.fromEntries(
          Object.entries(payload.data).map(([k, v]) => [k, String(v)])
        )
      : undefined,
    android: {
      priority: 'high',
      notification: {
        channelId: 'trading',
        priority: 'high',
        defaultSound: true,
        defaultVibrateTimings: true,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);

    let sent = response.successCount;
    let failed = response.failureCount;

    // Handle failed tokens
    if (response.failureCount > 0) {
      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          const error = resp.error;

          // Remove invalid tokens
          if (
            error?.code === 'messaging/invalid-registration-token' ||
            error?.code === 'messaging/registration-token-not-registered'
          ) {
            const sub = validSubscriptions[index];
            if (sub) {
              removeSubscription(sub.id);
              console.log(`[Firebase] Removed invalid token: ${sub.id}`);
            }
          } else {
            console.error(`[Firebase] Send error:`, error?.message);
          }
        }
      });
    }

    return { sent, failed };
  } catch (error) {
    console.error('[Firebase] Error sending notifications:', error);
    return { sent: 0, failed: subscriptions.length };
  }
}

/**
 * Subscribe a token to a topic (useful for broadcast messages)
 */
export async function subscribeToTopic(
  token: string,
  topic: string
): Promise<boolean> {
  if (!initFirebase()) return false;

  try {
    await admin.messaging().subscribeToTopic(token, topic);
    console.log(`[Firebase] Subscribed to topic: ${topic}`);
    return true;
  } catch (error) {
    console.error('[Firebase] Error subscribing to topic:', error);
    return false;
  }
}

/**
 * Send notification to a topic (all subscribed devices)
 */
export async function sendToTopic(
  topic: string,
  payload: NotificationPayload
): Promise<boolean> {
  if (!initFirebase()) return false;

  const message: admin.messaging.Message = {
    topic,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    android: {
      priority: 'high',
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log(`[Firebase] Sent to topic ${topic}:`, response);
    return true;
  } catch (error) {
    console.error('[Firebase] Error sending to topic:', error);
    return false;
  }
}
