// Firebase Service Worker for Push Notifications
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB-Bm3-8ke6lHz8ZhIyQfR4g7PKaTBgNI",
  authDomain: "mealpickerapp.firebaseapp.com",
  projectId: "mealpickerapp",
  storageBucket: "mealpickerapp.appspot.com",
  messagingSenderId: "283526597613",
  appId: "1:283526597613:web:8054416aeeccc6bd25b5e4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification?.title || 'MenuPick';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: 'menupick-notification',
    requireInteraction: true,
    data: payload.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = new URL('/', self.location.origin).href;

  // Handle action buttons
  if (event.action === 'view') {
    // Navigate to specific page based on notification data
    const targetUrl = event.notification.data?.targetUrl || '/';
    const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url.startsWith(self.location.origin)) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.navigate(targetUrl).then(() => matchingClient.focus());
      } else {
        return clients.openWindow(targetUrl);
      }
    });

    event.waitUntil(promiseChain);
  } else {
    // Default behavior - open app
    const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url.startsWith(self.location.origin)) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

    event.waitUntil(promiseChain);
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification);
});

// PWA: Basic Install Event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// PWA: Activate Event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// PWA: Fetch Event (Required for PWA installability)
self.addEventListener('fetch', (event) => {
  // Basic pass-through fetch. 
  // For a full offline experience, we would add caching logic here.
  event.respondWith(fetch(event.request));
});