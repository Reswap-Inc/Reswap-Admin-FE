// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB5OnN05BdpGNCbVvIEGRrSsm92_xUjWn0",
  authDomain: "reswap-dev.firebaseapp.com",
  projectId: "reswap-dev",
  storageBucket: "reswap-dev.firebasestorage.app",
  messagingSenderId: "913341079048",
  appId: "1:913341079048:web:00d1a3e50eeab0595bfbbd",
  measurementId: "G-XGE3GPQN52"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
