import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/auth';

export default function Index() {
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return null;
  }

  return <Redirect href={user ? '/dashboard' : '/login'} />;
}
