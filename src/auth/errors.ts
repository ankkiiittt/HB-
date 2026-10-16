import { ACCESS_RESTRICTED_MESSAGE } from './domain';

export const AUTH_ERROR_CODES = {
  DOMAIN_RESTRICTED: 'DOMAIN_RESTRICTED',
  POPUP_CLOSED: 'auth/popup-closed-by-user',
  POPUP_CANCELLED: 'auth/cancelled-popup-request',
  POPUP_BLOCKED: 'auth/popup-blocked',
  NETWORK_FAILED: 'auth/network-request-failed',
  USER_DISABLED: 'auth/user-disabled',
  OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
  INVALID_CREDENTIAL: 'auth/invalid-credential',
} as const;

export function getFriendlyAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (typeof error === 'string') {
    if (error === ACCESS_RESTRICTED_MESSAGE || error.includes('Access restricted')) {
      return ACCESS_RESTRICTED_MESSAGE;
    }
    return error;
  }

  const errObj = error as { code?: string; message?: string };
  const code = errObj.code || '';

  if (code === AUTH_ERROR_CODES.DOMAIN_RESTRICTED) {
    return ACCESS_RESTRICTED_MESSAGE;
  }

  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in window was closed before completing authentication.';
    case 'auth/cancelled-popup-request':
      return 'The sign-in request was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection and try again.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact your workspace administrator.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled in Firebase Authentication console.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Authentication. Please add it to Authorized Domains in the Firebase Console.';
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'Firebase API key is not yet configured or invalid. Please configure your live Firebase credentials in .env.';
    case 'auth/invalid-credential':
    case 'auth/user-token-expired':
      return 'Your login credentials have expired. Please sign in again.';
    default:
      if (errObj.message) {
        if (errObj.message.includes(ACCESS_RESTRICTED_MESSAGE)) {
          return ACCESS_RESTRICTED_MESSAGE;
        }
        return errObj.message;
      }
      return 'Authentication failed. Please try again.';
  }
}
