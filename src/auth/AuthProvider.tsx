import React, { useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, onIdTokenChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import type { UserProfile } from '../types/auth';

interface AuthContextValue {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isRestoring: boolean;
  error: string | null;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  setError: (error: string | null) => void;
  intendedDestination: string | null;
  setIntendedDestination: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAuthStore();

  useEffect(() => {
    // Single source of truth for Firebase session lifecycle
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      await store.validateAndSyncSession(currentUser);
    });

    // Guard against mid-session email claim alterations or token revocations
    const unsubscribeToken = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        await store.validateAndSyncSession(currentUser);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, []);

  const value: AuthContextValue = {
    user: store.user,
    firebaseUser: store.firebaseUser,
    isLoading: store.isLoading,
    isRestoring: store.isRestoring,
    error: store.error,
    signIn: store.signIn,
    signOut: store.signOut,
    clearError: store.clearError,
    setError: store.setError,
    intendedDestination: store.intendedDestination,
    setIntendedDestination: store.setIntendedDestination,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  const store = useAuthStore();

  if (!context) {
    return {
      user: store.user,
      firebaseUser: store.firebaseUser,
      isLoading: store.isLoading,
      isRestoring: store.isRestoring,
      error: store.error,
      signIn: store.signIn,
      signOut: store.signOut,
      clearError: store.clearError,
      setError: store.setError,
      intendedDestination: store.intendedDestination,
      setIntendedDestination: store.setIntendedDestination,
    };
  }

  return context;
}
