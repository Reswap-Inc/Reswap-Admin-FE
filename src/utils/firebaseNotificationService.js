import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebaseConfig';
import store from '../redux/store/store';
import { registerDevice } from '../network/generalApi';

class FirebaseNotificationService {
  constructor() {
    this.vapidKey = 'BOb7dqz6blHs1j3Kfv8R2aKXanJnne5LAR7zSGRvIWyLBStfhTQ6gO4DgmCdksHm-htPKp3DKu509REy3VB9gZs';
    this.isInitialized = false;
    this.serviceWorkerRegistration = null;
  }

  // Get the correct service worker path and scope based on environment
  getServiceWorkerConfig() {
    const isProduction = window.location.hostname === 'reswap.tmithun.com';
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isProduction) {
      return {
        path: '/web/admin/firebase-messaging-sw.js',
        scope: '/web/admin/'
      };
    } else if (isLocalhost) {
      return {
        path: '/firebase-messaging-sw.js',
        scope: '/'
      };
    } else {
      // For other environments, try to detect the base path
      const pathSegments = window.location.pathname.split('/');
      const basePath = pathSegments.length > 1 ? `/${pathSegments[1]}/` : '/';
      return {
        path: `${basePath}firebase-messaging-sw.js`,
        scope: basePath
      };
    }
  }

  // Check if service worker file is accessible
  async checkServiceWorkerAccessibility() {
    const config = this.getServiceWorkerConfig();
    try {
      const response = await fetch(config.path, { method: 'HEAD' });
      console.log('🔥 Service worker file accessibility check:', {
        path: config.path,
        status: response.status,
        ok: response.ok
      });
      return response.ok;
    } catch (error) {
      console.error('🔥 Service worker file not accessible:', config.path, error);
      return false;
    }
  }

  // Register the service worker with the correct path
  async registerServiceWorker() {
    try {
      const config = this.getServiceWorkerConfig();
      console.log('🔥 Registering service worker with config:', config);
      console.log('🔥 Current location:', window.location.href);
      console.log('🔥 Current pathname:', window.location.pathname);
      
      // Check if service worker file is accessible
      const isAccessible = await this.checkServiceWorkerAccessibility();
      if (!isAccessible) {
        throw new Error(`Service worker file not accessible at ${config.path}`);
      }
      
      // Check if service worker is already registered
      const existingRegistration = await navigator.serviceWorker.getRegistration(config.scope);
      if (existingRegistration) {
        console.log('🔥 Service worker already registered:', existingRegistration);
        this.serviceWorkerRegistration = existingRegistration;
        return existingRegistration;
      }
      
      this.serviceWorkerRegistration = await navigator.serviceWorker.register(config.path, { 
        scope: config.scope 
      });
      
      console.log('🔥 Service worker registered successfully at:', config.path, 'with scope:', config.scope);
      return this.serviceWorkerRegistration;
    } catch (error) {
      console.error('🔥 Error registering service worker:', error);
      console.error('🔥 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Request notification permission and get FCM token
  async requestPermissionAndGetToken() {
    console.log('🔥 Requesting FCM token...');
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return null;
      }
      const permission = await Notification.requestPermission();
      console.log('🔥 Permission result:', permission);
      if (permission === 'granted') {
        console.log('🔥 Notification permission granted');
        try {
          console.log('🔥 Getting FCM token...');
          
          // Ensure service worker is registered
          if (!this.serviceWorkerRegistration) {
            try {
              await this.registerServiceWorker();
            } catch (swError) {
              console.warn('🔥 Service worker registration failed, trying without it:', swError);
              // Continue without service worker registration
            }
          }
          
          const currentToken = await getToken(messaging, {
            vapidKey: this.vapidKey,
            serviceWorkerRegistration: this.serviceWorkerRegistration
          });
          
          if (currentToken) {
            console.log('🔥 FCM Token retrieved successfully:', currentToken);
            store.dispatch(registerDevice({
              userAgent: navigator.userAgent,
              type: 'web',
              token: currentToken
            }));
            return currentToken;
          } else {
            console.warn('🔥 No registration token available');
            return null;
          }
        } catch (tokenError) {
          console.error('🔥 Error getting FCM token:', tokenError);
          if (tokenError.code === 'messaging/failed-service-worker-registration') {
            console.log('🔥 Service worker failed, trying alternative method...');
            try {
              // Try to re-register service worker
              await this.registerServiceWorker();
              
              const alternativeToken = await getToken(messaging, {
                vapidKey: this.vapidKey,
                serviceWorkerRegistration: this.serviceWorkerRegistration
              });
              
              if (alternativeToken) {
                console.log('🔥 Alternative FCM Token retrieved:', alternativeToken);
                store.dispatch(registerDevice({
                  userAgent: navigator.userAgent,
                  type: 'web',
                  token: alternativeToken
                }));
                return alternativeToken;
              }
            } catch (altError) {
              console.log('🔥 Alternative method also failed:', altError);
            }
            const devToken = 'dev-fcm-token-' + Date.now();
            console.log('🔥 Using development token:', devToken);
            store.dispatch(registerDevice({
              userAgent: navigator.userAgent,
              type: 'web',
              token: devToken
            }));
            return devToken;
          }
          return null;
        }
      } else if (permission === 'denied') {
        console.warn('🔥 Notification permission denied by user');
        return null;
      } else {
        console.warn('🔥 Notification permission request was dismissed');
        return null;
      }
    } catch (error) {
      console.error('🔥 Error requesting notification permission:', error);
      return null;
    }
  }

  // Initialize Firebase messaging
  async initialize() {
    console.log('🔥 Initializing Firebase notification service...');
    if (this.isInitialized) {
      console.log('🔥 Service already initialized');
      return;
    }
    try {
      const token = await this.requestPermissionAndGetToken();
      if (token) {
        this.setupForegroundMessageListener();
        this.isInitialized = true;
        if (token.startsWith('dev-fcm-token-')) {
          console.log('🔥 Firebase service initialized with development token');
        } else {
          console.log('🔥 Firebase service initialized with real FCM token');
        }
        return token;
      } else {
        console.log('🔥 No token received, initialization incomplete');
        return null;
      }
    } catch (error) {
      console.error('🔥 Error initializing Firebase notification service:', error);
      return null;
    }
  }

  setupForegroundMessageListener() {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('🔥 Foreground message received:', payload);
      if (payload.notification) {
        this.showNotification(payload.notification);
      }
    });
    this.unsubscribeForeground = unsubscribe;
  }

  showNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notificationOptions = {
        body: notification.body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'reswap-notification',
        requireInteraction: false
      };
      const notificationInstance = new Notification(notification.title, notificationOptions);
      notificationInstance.onclick = function(event) {
        event.preventDefault();
        window.focus();
        notificationInstance.close();
        console.log('🔥 Notification clicked');
      };
      setTimeout(() => {
        notificationInstance.close();
      }, 5000);
    }
  }

  cleanup() {
    if (this.unsubscribeForeground) {
      this.unsubscribeForeground();
    }
    this.isInitialized = false;
  }
}

const firebaseNotificationService = new FirebaseNotificationService();

export default firebaseNotificationService;
