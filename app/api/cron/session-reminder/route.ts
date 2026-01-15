import { NextResponse } from 'next/server';
import webPush from 'web-push';
import { createClient } from '@libsql/client';

// Session reminders configuration
const SESSION_REMINDERS: Record<string, { title: string; body: string }> = {
  'session-start': {
    title: '🔔 NY Session Started',
    body: 'Get on the charts! NY session is now live.',
  },
  'news-release': {
    title: '📰 News Release',
    body: 'Economic news incoming - check the calendar!',
  },
  'indices-open': {
    title: '📈 Indices Open',
    body: 'US indices are now open for trading.',
  },
};

// Initialize web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(
    'mailto:hello@zenphony.audio',
    vapidPublicKey,
    vapidPrivateKey
  );
}

// Initialize Turso client
function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('Missing TURSO_DATABASE_URL');
  }

  return createClient({
    url,
    authToken,
  });
}

export async function GET(request: Request) {
  try {
    // Verify this is a legitimate cron request from Vercel
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // In development, allow without auth
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Get reminder type from URL params
    const { searchParams } = new URL(request.url);
    const reminderType = searchParams.get('type') || 'session-start';

    const reminder = SESSION_REMINDERS[reminderType];
    if (!reminder) {
      return NextResponse.json({ error: 'Invalid reminder type' }, { status: 400 });
    }

    console.log(`[Cron] Sending notification: ${reminder.title}`);

    // Get all active web push subscriptions from Turso
    const turso = getTursoClient();

    const result = await turso.execute({
      sql: 'SELECT * FROM push_subscriptions WHERE type = ? AND enabled = 1',
      args: ['web'],
    });

    const subscriptions = result.rows;

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[Cron] No active subscriptions found');
      return NextResponse.json({
        success: true,
        message: 'No subscriptions to notify',
        sent: 0,
      });
    }

    console.log(`[Cron] Found ${subscriptions.length} subscriptions`);

    // Send notifications to all subscribers
    const payload = JSON.stringify({
      title: reminder.title,
      body: reminder.body,
      tag: reminderType,
      url: '/',
      data: {
        reminderId: reminderType,
        timestamp: Date.now(),
      },
    });

    let sent = 0;
    let failed = 0;
    const failedIds: string[] = [];

    await Promise.all(
      subscriptions.map(async (sub) => {
        if (!sub.subscription) return;

        try {
          // Parse the subscription JSON string
          const subscriptionData = typeof sub.subscription === 'string'
            ? JSON.parse(sub.subscription)
            : sub.subscription;

          await webPush.sendNotification(subscriptionData, payload, {
            TTL: 60 * 60, // 1 hour
            urgency: 'high',
          });
          sent++;
        } catch (error: any) {
          failed++;

          // Remove expired/invalid subscriptions
          if (error.statusCode === 404 || error.statusCode === 410) {
            failedIds.push(sub.id as string);
            console.log(`[Cron] Subscription expired: ${sub.id}`);
          } else {
            console.error(`[Cron] Send error:`, error.message);
          }
        }
      })
    );

    // Clean up expired subscriptions
    if (failedIds.length > 0) {
      for (const id of failedIds) {
        await turso.execute({
          sql: 'DELETE FROM push_subscriptions WHERE id = ?',
          args: [id],
        });
      }
      console.log(`[Cron] Removed ${failedIds.length} expired subscriptions`);
    }

    // Log the notification
    await turso.execute({
      sql: `INSERT INTO notification_logs (id, reminder_id, recipient_count, success_count, failure_count)
            VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?)`,
      args: [reminderType, subscriptions.length, sent, failed],
    });

    console.log(`[Cron] Sent: ${sent}, Failed: ${failed}`);

    return NextResponse.json({
      success: true,
      reminder: reminderType,
      sent,
      failed,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('[Cron] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
