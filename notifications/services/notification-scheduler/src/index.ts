import 'dotenv/config';
import cron from 'node-cron';
import { sendWebPushNotifications } from './providers/web-push.js';
import { sendExpoPushNotifications } from './providers/expo.js';
import { sendFirebaseNotifications } from './providers/firebase.js';
import { getActiveSubscriptions, logNotificationSent } from './database.js';

const NY_TIMEZONE = 'America/New_York';

interface SessionReminder {
  id: string;
  cronExpression: string;
  title: string;
  body: string;
}

const SESSION_REMINDERS: SessionReminder[] = [
  {
    id: 'session_start',
    cronExpression: '0 8 * * 1-5', // 8:00 AM Mon-Fri NY
    title: '🔔 NY Session Started',
    body: 'Get on the charts! NY session is now live.',
  },
  {
    id: 'news_release',
    cronExpression: '30 8 * * 1-5', // 8:30 AM Mon-Fri NY
    title: '📰 News Release',
    body: 'Economic news incoming - check the calendar!',
  },
  {
    id: 'indices_open',
    cronExpression: '30 9 * * 1-5', // 9:30 AM Mon-Fri NY
    title: '📈 Indices Open',
    body: 'US indices are now open for trading.',
  },
];

/**
 * Send notifications to all platforms
 */
async function sendNotifications(reminder: SessionReminder): Promise<void> {
  console.log(`\n[${new Date().toISOString()}] Sending: ${reminder.title}`);

  const payload = {
    title: reminder.title,
    body: reminder.body,
    tag: reminder.id,
    data: {
      reminderId: reminder.id,
      timestamp: Date.now(),
    },
  };

  try {
    // Get all active subscriptions from database
    const subscriptions = await getActiveSubscriptions();

    if (subscriptions.length === 0) {
      console.log('[Scheduler] No active subscriptions found');
      return;
    }

    console.log(`[Scheduler] Found ${subscriptions.length} active subscriptions`);

    // Group subscriptions by type
    const webSubscriptions = subscriptions.filter((s) => s.type === 'web');
    const expoSubscriptions = subscriptions.filter((s) => s.type === 'expo');
    const fcmSubscriptions = subscriptions.filter((s) => s.type === 'fcm');

    // Send to all platforms in parallel
    const results = await Promise.allSettled([
      webSubscriptions.length > 0 ? sendWebPushNotifications(webSubscriptions, payload) : Promise.resolve({ sent: 0, failed: 0 }),
      expoSubscriptions.length > 0 ? sendExpoPushNotifications(expoSubscriptions, payload) : Promise.resolve({ sent: 0, failed: 0 }),
      fcmSubscriptions.length > 0 ? sendFirebaseNotifications(fcmSubscriptions, payload) : Promise.resolve({ sent: 0, failed: 0 }),
    ]);

    // Log results
    const [webResult, expoResult, fcmResult] = results;

    console.log('[Scheduler] Results:');
    console.log(`  - Web Push: ${webResult.status === 'fulfilled' ? `${webResult.value.sent} sent, ${webResult.value.failed} failed` : 'error'}`);
    console.log(`  - Expo: ${expoResult.status === 'fulfilled' ? `${expoResult.value.sent} sent, ${expoResult.value.failed} failed` : 'error'}`);
    console.log(`  - FCM: ${fcmResult.status === 'fulfilled' ? `${fcmResult.value.sent} sent, ${fcmResult.value.failed} failed` : 'error'}`);

    // Log to database
    await logNotificationSent(reminder.id, subscriptions.length);
  } catch (error) {
    console.error('[Scheduler] Error sending notifications:', error);
  }
}

/**
 * Initialize the scheduler
 */
function initScheduler(): void {
  console.log('🔔 Zenphony Notification Scheduler Starting...\n');

  SESSION_REMINDERS.forEach((reminder) => {
    cron.schedule(
      reminder.cronExpression,
      () => {
        sendNotifications(reminder);
      },
      {
        timezone: NY_TIMEZONE,
      }
    );

    console.log(`[Scheduler] Scheduled: ${reminder.title}`);
    console.log(`  - Cron: ${reminder.cronExpression}`);
    console.log(`  - Timezone: ${NY_TIMEZONE}`);
    console.log('');
  });

  console.log('✅ Scheduler initialized successfully');
  console.log(`   Waiting for scheduled times in ${NY_TIMEZONE}...\n`);
}

/**
 * Test function to send a notification immediately
 */
async function testNotifications(): Promise<void> {
  const testReminder: SessionReminder = {
    id: 'test',
    cronExpression: '',
    title: '✅ Test Notification',
    body: 'If you see this, notifications are working!',
  };

  await sendNotifications(testReminder);
}

// Check for test flag
if (process.argv.includes('--test')) {
  console.log('Running test notification...\n');
  testNotifications().then(() => {
    console.log('\nTest complete. Exiting.');
    process.exit(0);
  });
} else {
  // Start the scheduler
  initScheduler();

  // Keep process running
  process.on('SIGINT', () => {
    console.log('\n\nShutting down scheduler...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\nShutting down scheduler...');
    process.exit(0);
  });
}
