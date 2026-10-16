import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getPlatformPersistence } from './persistence';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoApiKeyForHBPlusAppTesting12345',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'hb-plus-demo.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'hb-plus-demo',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'hb-plus-demo.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '100000000001',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:100000000001:web:hbplusappid123456789',
};

// Initialize or reuse Firebase App instance
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth with platform-appropriate token persistence
function createFirebaseAuth(): Auth {
  try {
    const existing = getAuth(app);
    if (existing) return existing;
  } catch {
    // Auth not yet initialized
  }

  try {
    const persistence = getPlatformPersistence();
    if (persistence) {
      return initializeAuth(app, { persistence });
    }
  } catch {
    // Fallback if already initialized or persistence configuration is not supported in current environment
  }

  return getAuth(app);
}

export const auth: Auth = createFirebaseAuth();
export const db: Firestore = getFirestore(app);
