// Service worker for background notifications
const CACHE_NAME = 'stroomprijs-stoplicht-v1';
let notificationSettings = {
  enabled: false,
  threshold: 0.20,
  volume: 50
};

// Cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NOTIFICATION_SETTINGS') {
    notificationSettings = event.data.settings;
    console.log('Service worker received notification settings:', notificationSettings);
  }
});

// Function to check electricity prices periodically
const checkElectricityPrices = async () => {
  try {
    if (!notificationSettings.enabled) return;

    // Fetch current electricity prices from API
    const response = await fetch('https://api.energyzero.nl/v1/energyprices?fromDate=2023-01-01T00%3A00%3A00.000Z&tillDate=2023-12-31T23%3A59%3A59.999Z&interval=4&usageType=1&inclBtw=true');
    const data = await response.json();
    
    // Get the current price
    const prices = data.Prices || [];
    let currentPrice = null;
    
    if (prices.length > 0) {
      const now = new Date();
      // Find the current price based on timestamp
      for (let i = 0; i < prices.length; i++) {
        const priceTime = new Date(prices[i].readingDate);
        if (priceTime <= now && (!prices[i+1] || new Date(prices[i+1].readingDate) > now)) {
          currentPrice = prices[i].price;
          break;
        }
      }
    }
    
    // Show notification if price is below threshold
    if (currentPrice !== null && currentPrice < notificationSettings.threshold) {
      self.registration.showNotification('Stroomprijs Alert', {
        body: `De stroomprijs is gedaald naar €${currentPrice.toFixed(2)}/kWh!`,
        icon: '/favicon.ico',
        tag: 'price-alert',
        data: { price: currentPrice }
      });
      
      // Store this notification to avoid repeated alerts for the same price
      localStorage.setItem('lastPriceAlert', JSON.stringify({
        price: currentPrice,
        timestamp: Date.now()
      }));
    }
  } catch (error) {
    console.error('Error checking electricity prices:', error);
  }
};

// Check prices every 15 minutes
setInterval(checkElectricityPrices, 15 * 60 * 1000);

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If a window client is already open, focus it
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
