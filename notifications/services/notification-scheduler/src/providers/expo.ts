import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
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

// Create Expo SDK instance
const expo = new Expo();

/**
 * Send push notifications via Expo
 */
export async function sendExpoPushNotifications(
  subscriptions: Subscription[],
  payload: NotificationPayload
): Promise<SendResult> {
  // Filter valid Expo push tokens
  const validSubscriptions = subscriptions.filter(
    (sub) => sub.token && Expo.isExpoPushToken(sub.token)
  );

  if (validSubscriptions.length === 0) {
    console.log('[Expo] No valid tokens to send to');
    return { sent: 0, failed: 0 };
  }

  // Create messages
  const messages: ExpoPushMessage[] = validSubscriptions.map((sub) => ({
    to: sub.token!,
    sound: 'default',
    title: payload.title,
    body: payload.body,
    data: payload.data,
    priority: 'high',
    channelId: 'trading', // Android notification channel
  }));

  // Chunk messages (Expo recommends batches of 100)
  const chunks = expo.chunkPushNotifications(messages);

  let sent = 0;
  let failed = 0;

  // Send each chunk
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);

      // Process tickets to track success/failure
      ticketChunk.forEach((ticket, index) => {
        if (ticket.status === 'ok') {
          sent++;
        } else {
          failed++;

          // Handle specific errors
          if (ticket.status === 'error') {
            const errorDetails = ticket.details;

            // Remove invalid tokens
            if (
              ticket.message?.includes('DeviceNotRegistered') ||
              ticket.message?.includes('InvalidCredentials')
            ) {
              const sub = validSubscriptions[index];
              if (sub) {
                removeSubscription(sub.id);
                console.log(`[Expo] Removed invalid token: ${sub.id}`);
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('[Expo] Error sending chunk:', error);
      failed += chunk.length;
    }
  }

  return { sent, failed };
}

/**
 * Check receipt status for sent notifications
 * Call this after some time to verify delivery
 */
export async function checkExpoReceipts(receiptIds: string[]): Promise<void> {
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  for (const chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      for (const receiptId in receipts) {
        const receipt = receipts[receiptId];

        if (receipt.status === 'ok') {
          console.log(`[Expo] Receipt ${receiptId}: delivered`);
        } else if (receipt.status === 'error') {
          console.error(`[Expo] Receipt ${receiptId} error:`, receipt.message);

          // Handle specific errors
          if (receipt.details?.error === 'DeviceNotRegistered') {
            // Token is no longer valid - should remove from database
            console.log('[Expo] Device no longer registered');
          }
        }
      }
    } catch (error) {
      console.error('[Expo] Error fetching receipts:', error);
    }
  }
}
