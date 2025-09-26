import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Firebase Messaging with better error handling
let messaging = null;

// Initialize messaging only if supported
export const initializeMessaging = async () => {
  try {
    const isMessagingSupported = await isSupported();
    if (isMessagingSupported) {
      messaging = getMessaging(app);
      return messaging;
    }
    return null;
  } catch (error) {
    console.log('Messaging not supported:', error.message);
    return null;
  }
};

// Get FCM token with improved error handling
export const getFCMToken = async () => {
  try {
    if (!messaging) {
      messaging = await initializeMessaging();
      if (!messaging) {
        throw new Error('Messaging not available');
      }
    }

    // Check notification permission first
    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    // Get VAPID key from environment
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      throw new Error('VAPID key not configured');
    }

    // Get token
    const token = await getToken(messaging, { vapidKey });
    
    if (!token) {
      throw new Error('No registration token available');
    }

    return token;
  } catch (error) {
    // Don't log permission denied errors as errors - they're expected
    if (error.message.includes('permission') || error.message.includes('NotAllowed')) {
      console.log('Notification permission not granted for FCM token');
    } else {
      console.log('Error getting FCM token:', error.message);
    }
    throw error;
  }
};

// Handle foreground messages
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.log('Messaging not initialized');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    callback(payload);
  });
};

// Check if notifications are supported
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

// Get current permission status
export const getNotificationPermission = () => {
  return Notification.permission;
};

export { messaging };
export default app;