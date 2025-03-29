// Service worker for push notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker activated and controlling the page');
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body || 'Stroomprijs update',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    timestamp: Date.now(),
    tag: data.tag || 'price-update',
    requireInteraction: true,
    data: {
      url: data.url || self.registration.scope,
      timeStamp: Date.now(),
      actions: data.actions || []
    }
  };

  if (data.sound) {
    options.silent = false;
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Stroomprijs Stoplicht', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  let targetUrl = event.notification.data.url;
  
  if (event.action) {
    if (event.action === 'view_details') {
      targetUrl = event.notification.data.detailsUrl || targetUrl;
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('navigate' in client) {
          return client.navigate(targetUrl).then(client => client.focus());
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'price-update-sync') {
    event.waitUntil(
      fetch('/api/latest-prices')
        .then(response => response.json())
        .then(data => {
          console.log('Background sync successful');
        })
        .catch(error => {
          console.error('Background sync failed:', error);
        })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_PRICES') {
    console.log('Checking prices from service worker');
  }
});
