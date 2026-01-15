// Zenphony Trading Session Reminder Service Worker

const CACHE_NAME = 'zenphony-v1';

// Handle push notifications
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push received');

  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Zenphony', body: event.data.text() };
    }
  }

  const options = {
    body: data.body || 'Trading session reminder',
    icon: '/zenphony-icon.svg',
    badge: '/zenphony-icon.svg',
    vibrate: [200, 100, 200],
    tag: data.tag || 'session-reminder',
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Open Charts', icon: '/icons/chart.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/icons/close.png' },
    ],
    data: {
      url: data.url || '/',
      reminderId: data.reminderId || null,
      timestamp: Date.now(),
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Zenphony Trader', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification clicked');

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open or focus the app
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          if (urlToOpen !== '/') {
            client.navigate(urlToOpen);
          }
          return;
        }
      }

      // Open new window if not already open
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function (event) {
  console.log('[Service Worker] Notification closed');
});

// Install event - cache essential assets
self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/zenphony-icon.svg',
        '/offline.html',
      ]).catch((err) => {
        console.log('[Service Worker] Cache failed:', err);
      });
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );

  // Take control of all clients immediately
  self.clients.claim();
});

// Periodic sync for background tasks (if supported)
self.addEventListener('periodicsync', function (event) {
  if (event.tag === 'check-reminders') {
    console.log('[Service Worker] Periodic sync: check-reminders');
    // Could fetch updated reminder times here
  }
});

// Background sync for offline actions
self.addEventListener('sync', function (event) {
  if (event.tag === 'sync-subscriptions') {
    console.log('[Service Worker] Background sync: sync-subscriptions');
    // Could sync subscription data here
  }
});
