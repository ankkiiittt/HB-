import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { getAllowedDomain } from './domain';
import type { GoogleAuthService } from './googleSignIn';

WebBrowser.maybeCompleteAuthSession();

// Google OpenID Discovery Document endpoint
const GOOGLE_DISCOVERY: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const googleAuthService: GoogleAuthService = {
  async signInWithGoogle(loginHint?: string): Promise<FirebaseUser> {
    const clientId =
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
      '';

    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'hbplus',
      path: 'auth/callback',
    });

    const extraParams: Record<string, string> = {
      prompt: 'select_account',
    };

    if (loginHint) {
      extraParams.login_hint = loginHint;
    }

    if (process.env.EXPO_PUBLIC_USE_HD_HINT === 'true') {
      extraParams.hd = getAllowedDomain();
    }

    const request = new AuthSession.AuthRequest({
      clientId,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri,
      extraParams,
    });

    const result = await request.promptAsync(GOOGLE_DISCOVERY);

    if (result.type === 'cancel' || result.type === 'dismiss') {
      const err = new Error('Sign-in cancelled by user.');
      (err as { code?: string }).code = 'auth/popup-closed-by-user';
      throw err;
    }

    if (result.type !== 'success') {
      const err = new Error(`Native OAuth flow ended with status: ${result.type}`);
      (err as { code?: string }).code = 'auth/cancelled-popup-request';
      throw err;
    }

    const { id_token: idToken } = result.params;
    if (!idToken) {
      throw new Error('Google OAuth did not return a valid ID token.');
    }

    // Exchange Google ID token for Firebase Auth credential
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);

    return userCredential.user;
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },
};
