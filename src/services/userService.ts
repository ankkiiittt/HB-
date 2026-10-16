import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { db } from './firebase';
import type { UserProfile, UserRole } from '../types/auth';

/**
 * Synchronizes user document in Firestore on login:
 * - On first login: creates users/{uid} with role: 'user'
 * - On subsequent logins: preserves existing role (e.g. 'admin') and updates lastLoginAt
 */
export async function syncUserProfile(user: FirebaseUser): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();

  try {
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'HB+ Member',
        photoURL: user.photoURL || null,
        role: 'user', // Default role; must match Firestore security rule
        createdAt: now,
        lastLoginAt: now,
      };

      await setDoc(userRef, newProfile);
      return newProfile;
    }

    const data = snap.data();
    const existingRole: UserRole = data.role === 'admin' ? 'admin' : 'user';

    // Update lastLoginAt without modifying role or createdAt
    await updateDoc(userRef, {
      lastLoginAt: now,
      displayName: user.displayName || data.displayName || 'HB+ Member',
      photoURL: user.photoURL || data.photoURL || null,
    });

    return {
      uid: user.uid,
      email: data.email || user.email || '',
      displayName: user.displayName || data.displayName || 'HB+ Member',
      photoURL: user.photoURL || data.photoURL || null,
      role: existingRole,
      createdAt: data.createdAt || now,
      lastLoginAt: now,
    };
  } catch (error) {
    console.warn('Firestore profile sync fallback (local profile returned):', error);
    // If Firestore fails due to offline/demo mode, provide a valid local profile
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'HB+ Member',
      photoURL: user.photoURL || null,
      role: 'user',
      createdAt: now,
      lastLoginAt: now,
    };
  }
}

/**
 * Fetches user profile by uid.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (error) {
    console.warn(`Error fetching user profile for ${uid}:`, error);
    return null;
  }
}

/**
 * Lists all users for Admin dashboard.
 * Requires admin privileges enforced by Firestore security rules.
 */
export async function listAllUsers(): Promise<UserProfile[]> {
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('lastLoginAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs.map((d) => d.data() as UserProfile);
  } catch (error) {
    console.warn('Error querying all users from Firestore:', error);
    return [];
  }
}
