import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Session reminders with NY timezone times
// Note: For accurate NY timezone scheduling, we calculate UTC offset
const SESSION_REMINDERS = [
  {
    id: 'session_start',
    hour: 8,
    minute: 0,
    title: '🔔 NY Session Started',
    body: 'Get on the charts! NY session is now live.',
  },
  {
    id: 'news_release',
    hour: 8,
    minute: 30,
    title: '📰 News Release',
    body: 'Economic news incoming - check the calendar!',
  },
  {
    id: 'indices_open',
    hour: 9,
    minute: 30,
    title: '📈 Indices Open',
    body: 'US indices are now open for trading.',
  },
];

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and get Expo push token
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('[Notifications] Must use physical device for Push Notifications');
    return null;
  }

  // Check existing permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permission if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[Notifications] Permission not granted');
    return null;
  }

  // Get Expo push token
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: projectId || undefined,
    });

    console.log('[Notifications] Expo push token:', token.data);

    // Store token locally
    await AsyncStorage.setItem('expoPushToken', token.data);

    return token.data;
  } catch (error) {
    console.error('[Notifications] Error getting push token:', error);
    return null;
  }
}

/**
 * Setup notification channels for Android
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('trading', {
    name: 'Trading Alerts',
    description: 'Session reminders and market alerts',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#a78bfa',
    sound: 'default',
    enableVibrate: true,
    enableLights: true,
  });

  await Notifications.setNotificationChannelAsync('news', {
    name: 'News Alerts',
    description: 'Economic news and data releases',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });

  console.log('[Notifications] Android channels configured');
}

/**
 * Calculate NY timezone offset (handles DST)
 * NY is UTC-5 (EST) or UTC-4 (EDT during DST)
 */
function getNYOffset(): number {
  const now = new Date();
  const nyFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hour12: false,
  });
  const utcFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    hour12: false,
  });

  const nyHour = parseInt(nyFormatter.format(now));
  const utcHour = parseInt(utcFormatter.format(now));

  let offset = nyHour - utcHour;
  if (offset > 12) offset -= 24;
  if (offset < -12) offset += 24;

  return offset;
}

/**
 * Schedule local notifications for all session reminders
 */
export async function scheduleLocalNotifications(): Promise<void> {
  // Cancel all existing scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const nyOffset = getNYOffset();
  console.log(`[Notifications] NY timezone offset: UTC${nyOffset >= 0 ? '+' : ''}${nyOffset}`);

  for (const reminder of SESSION_REMINDERS) {
    // Convert NY time to UTC
    let utcHour = reminder.hour - nyOffset;
    if (utcHour < 0) utcHour += 24;
    if (utcHour >= 24) utcHour -= 24;

    // Schedule for weekdays (Monday = 2, Friday = 6 in Expo)
    for (let dayOfWeek = 2; dayOfWeek <= 6; dayOfWeek++) {
      try {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: reminder.title,
            body: reminder.body,
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { reminderId: reminder.id },
          },
          trigger: {
            hour: utcHour,
            minute: reminder.minute,
            weekday: dayOfWeek,
            repeats: true,
          },
        });

        console.log(
          `[Notifications] Scheduled ${reminder.id} for day ${dayOfWeek} at ${utcHour}:${reminder.minute} UTC (${reminder.hour}:${reminder.minute} NY)`
        );
      } catch (error) {
        console.error(`[Notifications] Error scheduling ${reminder.id}:`, error);
      }
    }
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log(`[Notifications] Total scheduled: ${scheduled.length}`);
}

/**
 * Send immediate test notification
 */
export async function sendTestNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✅ Notifications Enabled',
      body: 'You will receive trading session reminders at 8:00, 8:30, and 9:30 AM NY time.',
      sound: 'default',
    },
    trigger: { seconds: 1 },
  });
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('[Notifications] All scheduled notifications cancelled');
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  return settings.granted;
}

/**
 * Get stored push token
 */
export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem('expoPushToken');
}

/**
 * Save push token to backend
 */
export async function savePushTokenToBackend(token: string, userId: string): Promise<void> {
  try {
    const response = await fetch('https://zenphony.audio/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        userId,
        type: 'expo',
        deviceName: Device.modelName || 'Unknown Device',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save push token');
    }

    console.log('[Notifications] Push token saved to backend');
  } catch (error) {
    console.error('[Notifications] Error saving push token:', error);
  }
}
