import type { User as FirebaseUser } from 'firebase/auth';

export interface GoogleAuthService {
  /**
   * Prompts user for Google Sign-In and returns authenticated FirebaseUser.
   * Throws standard or mapped auth error if failed or cancelled.
   */
  signInWithGoogle(): Promise<FirebaseUser>;

  /**
   * Cleans up local session and signs out of Firebase.
   */
  signOut(): Promise<void>;
}

// Forward to platform-specific implementation
export { googleAuthService } from './googleSignInPlatform';
