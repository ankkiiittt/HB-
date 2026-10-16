import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useRole } from '../hooks/useRole';
import { useAppTheme } from '../theme';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import type { UserRole } from '../types/auth';

interface RoleGuardProps {
  allow: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allow,
  children,
  fallback,
}) => {
  const { role, hasRole } = useRole();
  const { colors, spacing, typography, radii } = useAppTheme();
  const router = useRouter();

  if (hasRole(allow)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Clean 403 Forbidden Screen
  return (
    <View style={[styles.container, { padding: spacing.lg }]}>
      <Card style={[styles.card, { maxWidth: 460 }]}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: colors.dangerBg,
                borderColor: colors.dangerBorder,
                borderRadius: radii.full,
              },
            ]}
          >
            <Text style={[styles.lockIcon, { color: colors.danger }]}>✕</Text>
          </View>
          <Text style={[styles.errorCode, { color: colors.danger }]}>403</Text>
          <Text
            style={[
              styles.title,
              typography.h2,
              { color: colors.textPrimary, marginTop: spacing.xs },
            ]}
          >
            Access Forbidden
          </Text>
          <Text
            style={[
              styles.description,
              typography.body,
              { color: colors.textSecondary, marginTop: spacing.sm },
            ]}
          >
            You are currently signed in as a{' '}
            <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
              {role}
            </Text>
            . This administrative area requires elevated permissions.
          </Text>

          <View style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
            <Badge role={role} />
          </View>

          <Button
            title="Return to Dashboard"
            variant="primary"
            onPress={() => router.replace('/dashboard')}
            style={{ width: '100%' }}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    alignItems: 'center',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    width: '100%',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  lockIcon: {
    fontSize: 20,
    fontWeight: '800',
  },
  errorCode: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
