import { create } from 'zustand';
import type { User as FirebaseUser } from 'firebase/auth';
import type { UserProfile } from '../types/auth';
import { isAllowedEmail, ACCESS_RESTRICTED_MESSAGE } from '../auth/domain';
import { getFriendlyAuthErrorMessage } from '../auth/errors';
import { googleAuthService } from '../auth/googleSignIn';
import { syncUserProfile } from '../services/userService';

interface AuthStoreState {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isRestoring: boolean;
  error: string | null;
  intendedDestination: string | null;

  // Actions
  setError: (error: string | null) => void;
  clearError: () => void;
  setIntendedDestination: (path: string | null) => void;
  signIn: (loginHint?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  validateAndSyncSession: (fbUser: FirebaseUser | null) => Promise<boolean>;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  firebaseUser: null,
  isLoading: false,
  isRestoring: true, // Start in restoring state so no login screen flashes
  error: null,
  intendedDestination: null,

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setIntendedDestination: (path) => set({ intendedDestination: path }),

  validateAndSyncSession: async (fbUser: FirebaseUser | null): Promise<boolean> => {
    if (!fbUser) {
      set({
        user: null,
        firebaseUser: null,
        isRestoring: false,
        isLoading: false,
      });
      return false;
    }

    // Defense-in-depth layer 2: Immediate client-side verification check
    const allowed = isAllowedEmail(fbUser.email, fbUser.emailVerified);

    if (!allowed) {
      // Defense-in-depth layer 3: Immediate teardown and state purge
      try {
        await googleAuthService.signOut();
      } catch {
        // Ignore sign-out error during forced ejection
      }

      set({
        user: null,
        firebaseUser: null,
        error: ACCESS_RESTRICTED_MESSAGE,
        isRestoring: false,
        isLoading: false,
      });
      return false;
    }

    // Sync Firestore profile and role
    try {
      const profile = await syncUserProfile(fbUser);
      set({
        user: profile,
        firebaseUser: fbUser,
        isRestoring: false,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err) {
      console.error('Failed to sync user profile:', err);
      // Fallback local profile if offline
      set({
        user: {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'HB+ Member',
          photoURL: fbUser.photoURL || null,
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
        firebaseUser: fbUser,
        isRestoring: false,
        isLoading: false,
      });
      return true;
    }
  },

  signIn: async (loginHint?: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const fbUser = await googleAuthService.signInWithGoogle(loginHint);
      const success = await get().validateAndSyncSession(fbUser);
      return success;
    } catch (err: unknown) {
      const friendlyMessage = getFriendlyAuthErrorMessage(err);
      set({
        isLoading: false,
        error: friendlyMessage,
      });
      return false;
    }
  },

  signOut: async (): Promise<void> => {
    set({ isLoading: true });
    try {
      await googleAuthService.signOut();
    } catch (error) {
      console.warn('Sign-out error:', error);
    } finally {
      set({
        user: null,
        firebaseUser: null,
        isLoading: false,
        error: null,
      });
    }
  },
}));
