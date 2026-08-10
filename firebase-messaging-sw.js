// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAXlZnWxnf0hNyGP8Xdx7t8YYHIFXwMZ5Q",
  authDomain: "shpax-a1451.firebaseapp.com",
  projectId: "shpax-a1451",
  storageBucket: "shpax-a1451.firebasestorage.app",
  messagingSenderId: "854026805745",
  appId: "1:854026805745:web:21dbb257fd46c0462d6450"
});

const messaging = firebase.messaging();

// Обработка фоновых уведомлений (когда приложение не в фокусе)
messaging.onBackgroundMessage((payload) => {
  console.log('Фоновое уведомление:', payload);
  const notificationTitle = payload.notification?.title || 'Новое сообщение';
  const notificationBody = payload.notification?.body || 'У вас новое сообщение';
  const notificationOptions = {
    body: notificationBody,
    icon: '/icon.png',  // добавьте свою иконку в корень
    data: payload.data || {},
    badge: '/badge.png' // опционально
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка клика по уведомлению (переход в чат)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const chatId = event.notification.data?.chatId;
  if (chatId) {
    const url = new URL('/', self.location.origin).href + `?chat=${chatId}`;
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (let client of windowClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  } else {
    event.waitUntil(clients.openWindow('/'));
  }
});
