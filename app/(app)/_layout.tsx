import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../src/auth';
import { useRole } from '../../src/hooks/useRole';
import { useAppTheme } from '../../src/theme';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';

export default function AppGroupLayout() {
  const { user, signOut } = useAuth();
  const { isAdmin, role } = useRole();
  const { colors, spacing, typography, radii } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Top Navigation Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <View style={styles.headerInner}>
          {/* Logo & Navigation Links */}
          <View style={styles.leftNav}>
            <Pressable
              onPress={() => router.push('/dashboard')}
              style={styles.logoPressable}
              accessibilityRole="button"
              accessibilityLabel="Navigate to Dashboard"
            >
              <View
                style={[
                  styles.logoBadge,
                  { backgroundColor: colors.accent, borderRadius: radii.sm },
                ]}
              >
                <Text style={styles.logoText}>HB+</Text>
              </View>
              <Text style={[styles.navTitle, typography.h3, { color: colors.textPrimary }]}>
                HB+
              </Text>
            </Pressable>

            {/* Nav Tabs */}
            <View style={styles.tabContainer}>
              <Pressable
                onPress={() => router.push('/dashboard')}
                style={[
                  styles.navTab,
                  pathname === '/dashboard' && {
                    backgroundColor: colors.accentLight,
                    borderRadius: radii.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.navTabText,
                    typography.bodyBold,
                    {
                      color:
                        pathname === '/dashboard' ? colors.accent : colors.textSecondary,
                    },
                  ]}
                >
                  Dashboard
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/admin')}
                style={[
                  styles.navTab,
                  pathname === '/admin' && {
                    backgroundColor: colors.accentLight,
                    borderRadius: radii.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.navTabText,
                    typography.bodyBold,
                    {
                      color:
                        pathname === '/admin' ? colors.accent : colors.textSecondary,
                    },
                  ]}
                >
                  Admin
                </Text>
              </Pressable>
            </View>
          </View>

          {/* User Profile & Logout */}
          <View style={styles.rightNav}>
            <View style={styles.userInfo}>
              <Avatar
                photoURL={user?.photoURL}
                name={user?.displayName}
                email={user?.email}
                size="sm"
              />
              <View style={styles.userMeta}>
                <Text
                  style={[styles.userName, typography.bodyBold, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {user?.displayName || 'HB+ Member'}
                </Text>
                <Badge role={role} />
              </View>
            </View>

            <Pressable
              onPress={signOut}
              accessibilityRole="button"
              accessibilityLabel="Sign out of account"
              style={({ pressed }) => [
                styles.logoutBtn,
                {
                  borderColor: colors.border,
                  borderRadius: radii.sm,
                  backgroundColor: colors.surfaceSubtle,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.logoutText, typography.caption, { color: colors.textSecondary }]}>
                Sign Out
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Screen Outlet */}
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  header: {
    borderBottomWidth: 1,
    width: '100%',
    zIndex: 10,
    ...(Platform.OS === 'web' ? ({ position: 'sticky', top: 0 } as any) : {}),
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  leftNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  logoBadge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  navTitle: {
    fontWeight: '800',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  navTabText: {
    fontSize: 14,
  },
  rightNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  userMeta: {
    marginLeft: 8,
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 13,
    marginBottom: 2,
    maxWidth: 140,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
    width: '100%',
  },
});
