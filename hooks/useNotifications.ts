'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isPushSupported,
  getPermissionStatus,
  requestPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribed,
  sendTestNotification,
  getExistingSubscription,
} from '@/lib/notifications';
import { useAuth } from '@/contexts/auth-context';

interface UseNotificationsReturn {
  /** Whether push notifications are supported in this browser */
  isSupported: boolean;
  /** Current permission status */
  permission: NotificationPermission | 'unsupported';
  /** Whether user is currently subscribed */
  subscribed: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Enable notifications */
  enableNotifications: () => Promise<boolean>;
  /** Disable notifications */
  disableNotifications: () => Promise<boolean>;
  /** Send a test notification */
  testNotification: () => Promise<void>;
  /** Refresh subscription status */
  refresh: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check initial state
  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const supported = isPushSupported();
        setIsSupported(supported);

        if (!supported) {
          setPermission('unsupported');
          setSubscribed(false);
          return;
        }

        setPermission(getPermissionStatus());
        const sub = await isSubscribed();
        setSubscribed(sub);
      } catch (err) {
        console.error('[useNotifications] Error checking status:', err);
        setError('Failed to check notification status');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  // Enable notifications
  const enableNotifications = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Request permission
      const perm = await requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        setError('Notification permission was denied');
        return false;
      }

      // Subscribe to push
      const subscription = await subscribeToPush(user?.id);

      if (!subscription) {
        setError('Failed to subscribe to notifications');
        return false;
      }

      setSubscribed(true);
      return true;
    } catch (err) {
      console.error('[useNotifications] Error enabling:', err);
      setError('Failed to enable notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Disable notifications
  const disableNotifications = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await unsubscribeFromPush();
      if (success) {
        setSubscribed(false);
      } else {
        setError('Failed to disable notifications');
      }
      return success;
    } catch (err) {
      console.error('[useNotifications] Error disabling:', err);
      setError('Failed to disable notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send test notification
  const testNotification = useCallback(async (): Promise<void> => {
    try {
      await sendTestNotification();
    } catch (err) {
      console.error('[useNotifications] Error sending test:', err);
      setError('Failed to send test notification');
    }
  }, []);

  // Refresh status
  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      setPermission(getPermissionStatus());
      const sub = await isSubscribed();
      setSubscribed(sub);
    } catch (err) {
      console.error('[useNotifications] Error refreshing:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    subscribed,
    isLoading,
    error,
    enableNotifications,
    disableNotifications,
    testNotification,
    refresh,
  };
}
