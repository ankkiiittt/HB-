import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/auth';
import { Loader } from '../src/components/Loader';
import { useAppTheme } from '../src/theme';

function RootNavigation() {
  const { user, isRestoring, intendedDestination, setIntendedDestination } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();
  const { isDark } = useAppTheme();

  useEffect(() => {
    if (isRestoring) return;

    const inAppGroup = segments[0] === '(app)';
    const isLoginPage = segments[0] === 'login';

    if (!user) {
      // Unauthenticated: if attempting to access protected route, save destination and redirect
      if (inAppGroup || (!isLoginPage && segments.length > 0)) {
        if (pathname && pathname !== '/login') {
          setIntendedDestination(pathname);
        }
        router.replace('/login');
      }
    } else {
      // Authenticated: if currently on login screen, redirect to intended destination or dashboard
      if (isLoginPage) {
        const target = intendedDestination || '/dashboard';
        setIntendedDestination(null);
        router.replace(target as any);
      }
    }
  }, [user, isRestoring, segments, pathname]);

  if (isRestoring) {
    return <Loader message="Verifying HB+ credentials..." fullScreen />;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="login" options={{ title: 'HB+ Login' }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
