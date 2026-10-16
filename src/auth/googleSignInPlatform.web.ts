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

function createGoogleProvider(loginHint?: string): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  const customParams: Record<string, string> = {
    prompt: 'select_account',
  };

  if (loginHint) {
    customParams.login_hint = loginHint;
  }

  // Only pass Google's 'hd' parameter if explicitly enabled,
  // allowing developers and testers to choose or type any Google account.
  if (process.env.EXPO_PUBLIC_USE_HD_HINT === 'true') {
    customParams.hd = getAllowedDomain();
  }

  provider.setCustomParameters(customParams);
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
  async signInWithGoogle(loginHint?: string): Promise<FirebaseUser> {
    const provider = createGoogleProvider(loginHint);

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
