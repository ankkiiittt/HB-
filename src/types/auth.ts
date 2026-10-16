import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isRestoring: boolean;
  error: string | null;
}

export interface GoogleSignInResult {
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}
