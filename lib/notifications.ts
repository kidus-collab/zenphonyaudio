/**
 * Web Push Notifications for Zenphony Trading Session Reminders
 */

interface SubscriptionData {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Get current notification permission status
 */
export function getPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[Notifications] Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[Notifications] Service worker registered:', registration.scope);

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    return registration;
  } catch (error) {
    console.error('[Notifications] Service worker registration failed:', error);
    return null;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(userId?: string): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    console.warn('[Notifications] Push not supported');
    return null;
  }

  try {
    // Register service worker first
    const registration = await registerServiceWorker();
    if (!registration) return null;

    // Get VAPID public key from environment
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.error('[Notifications] VAPID public key not configured');
      return null;
    }

    // Convert VAPID key to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log('[Notifications] Push subscription created');

    // Send subscription to backend
    await saveSubscriptionToBackend(subscription, userId);

    return subscription;
  } catch (error) {
    console.error('[Notifications] Failed to subscribe to push:', error);
    return null;
  }
}

/**
 * Get existing push subscription
 */
export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error('[Notifications] Error getting subscription:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const subscription = await getExistingSubscription();
    if (!subscription) return true;

    // Unsubscribe from browser
    const success = await subscription.unsubscribe();

    // Remove from backend
    if (success) {
      await removeSubscriptionFromBackend(subscription);
    }

    return success;
  } catch (error) {
    console.error('[Notifications] Failed to unsubscribe:', error);
    return false;
  }
}

/**
 * Save subscription to backend
 */
async function saveSubscriptionToBackend(
  subscription: PushSubscription,
  userId?: string
): Promise<void> {
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userId,
        type: 'web',
        deviceName: getDeviceName(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save subscription');
    }

    console.log('[Notifications] Subscription saved to backend');
  } catch (error) {
    console.error('[Notifications] Error saving subscription:', error);
  }
}

/**
 * Remove subscription from backend
 */
async function removeSubscriptionFromBackend(
  subscription: PushSubscription
): Promise<void> {
  try {
    await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    console.log('[Notifications] Subscription removed from backend');
  } catch (error) {
    console.error('[Notifications] Error removing subscription:', error);
  }
}

/**
 * Convert URL-safe base64 to Uint8Array (for VAPID key)
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Get device name for subscription tracking
 */
function getDeviceName(): string {
  const ua = navigator.userAgent;

  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS Device';
  if (/Android/.test(ua)) return 'Android Device';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac/.test(ua)) return 'macOS';
  if (/Linux/.test(ua)) return 'Linux';

  return 'Unknown Device';
}

/**
 * Send a local test notification (for testing)
 */
export async function sendTestNotification(): Promise<void> {
  if (!isPushSupported()) {
    throw new Error('Notifications not supported');
  }

  if (Notification.permission !== 'granted') {
    throw new Error('Notification permission not granted');
  }

  const registration = await navigator.serviceWorker.ready;

  await registration.showNotification('✅ Notifications Enabled', {
    body: 'You will receive trading session reminders at 8:00, 8:30, and 9:30 AM NY time.',
    icon: '/zenphony-icon.svg',
    badge: '/zenphony-icon.svg',
    tag: 'test-notification',
  });
}

/**
 * Check if the user is subscribed to push notifications
 */
export async function isSubscribed(): Promise<boolean> {
  const subscription = await getExistingSubscription();
  return subscription !== null;
}
