import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { getAllowedDomain } from './domain';
import type { GoogleAuthService } from './googleSignIn';

function createGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  // UX Hint: Google OAuth hosted domain parameter (defense in depth layer 1)
  provider.setCustomParameters({
    hd: getAllowedDomain(),
    prompt: 'select_account',
  });
  provider.addScope('email');
  provider.addScope('profile');
  return provider;
}

/**
 * Detects if the web browser is running on a mobile device where popups frequently fail.
 */
function isMobileWeb(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export const googleAuthService: GoogleAuthService = {
  async signInWithGoogle(): Promise<FirebaseUser> {
    const provider = createGoogleProvider();

    // Check if there is a pending redirect result first
    try {
      const redirectResult = await getRedirectResult(auth);
      if (redirectResult && redirectResult.user) {
        return redirectResult.user;
      }
    } catch {
      // Continue to popup/redirect below
    }

    // On mobile web browsers, use redirect flow to avoid popup blockers
    if (isMobileWeb()) {
      try {
        await signInWithRedirect(auth, provider);
        // Will reload/redirect to Google
        throw new Error('Redirecting to Google sign-in...');
      } catch (err: unknown) {
        // If redirect fails or throws, try popup as fallback
        const result = await signInWithPopup(auth, provider);
        return result.user;
      }
    }

    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: unknown) {
      const err = error as { code?: string };
      // Fallback to redirect if popup is blocked
      if (err?.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, provider);
        throw new Error('Popup was blocked; redirecting to Google sign-in...');
      }
      throw error;
    }
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },
};
