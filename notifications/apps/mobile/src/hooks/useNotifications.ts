import { useEffect, useRef, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotifications,
  setupNotificationChannels,
  scheduleLocalNotifications,
  sendTestNotification as sendTest,
  areNotificationsEnabled,
  getScheduledNotifications,
  cancelAllNotifications,
  getStoredPushToken,
} from '../services/notifications';

interface UseNotificationsReturn {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  permissionGranted: boolean;
  isLoading: boolean;
  scheduledCount: number;
  requestPermissions: () => Promise<boolean>;
  sendTestNotification: () => Promise<void>;
  refreshSchedule: () => Promise<void>;
  disableNotifications: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduledCount, setScheduledCount] = useState(0);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Initialize notifications
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      try {
        // Check existing permission
        const enabled = await areNotificationsEnabled();
        setPermissionGranted(enabled);

        if (enabled) {
          // Setup channels (Android)
          await setupNotificationChannels();

          // Get or register push token
          let token = await getStoredPushToken();
          if (!token) {
            token = await registerForPushNotifications();
          }
          setExpoPushToken(token);

          // Schedule local notifications
          await scheduleLocalNotifications();

          // Get scheduled count
          const scheduled = await getScheduledNotifications();
          setScheduledCount(scheduled.length);
        }
      } catch (error) {
        console.error('[useNotifications] Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[useNotifications] Notification received:', notification);
      setNotification(notification);
    });

    // Listen for notification interactions
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('[useNotifications] Notification response:', response);
      const data = response.notification.request.content.data;

      // Handle navigation based on notification type
      if (data?.reminderId) {
        // Could navigate to specific screen here
        console.log('[useNotifications] Reminder tapped:', data.reminderId);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Request permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      const token = await registerForPushNotifications();

      if (token) {
        setExpoPushToken(token);
        setPermissionGranted(true);

        await setupNotificationChannels();
        await scheduleLocalNotifications();

        const scheduled = await getScheduledNotifications();
        setScheduledCount(scheduled.length);

        return true;
      }

      return false;
    } catch (error) {
      console.error('[useNotifications] Error requesting permissions:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send test notification
  const sendTestNotification = useCallback(async (): Promise<void> => {
    await sendTest();
  }, []);

  // Refresh schedule
  const refreshSchedule = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      await scheduleLocalNotifications();
      const scheduled = await getScheduledNotifications();
      setScheduledCount(scheduled.length);
    } catch (error) {
      console.error('[useNotifications] Error refreshing schedule:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Disable notifications
  const disableNotifications = useCallback(async (): Promise<void> => {
    await cancelAllNotifications();
    setScheduledCount(0);
  }, []);

  return {
    expoPushToken,
    notification,
    permissionGranted,
    isLoading,
    scheduledCount,
    requestPermissions,
    sendTestNotification,
    refreshSchedule,
    disableNotifications,
  };
}
