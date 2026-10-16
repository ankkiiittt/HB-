import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, getAllowedDomain } from '../../src/auth';
import { useRole } from '../../src/hooks/useRole';
import { useAppTheme } from '../../src/theme';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Card } from '../../src/components/Card';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { formatDate } from '../../src/utils/formatDate';

export default function DashboardScreen() {
  const { user, signOut, isLoading } = useAuth();
  const { isAdmin, role } = useRole();
  const { colors, spacing, typography, radii } = useAppTheme();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const isWide = width >= 768;
  const allowedDomain = getAllowedDomain();

  return (
    <ScreenContainer scrollable maxWidth={1100}>
      {/* Welcome Banner Card */}
      <Card style={styles.welcomeCard}>
        <View style={[styles.welcomeRow, !isWide && styles.welcomeRowMobile]}>
          <View style={styles.avatarWrapper}>
            <Avatar
              photoURL={user?.photoURL}
              name={user?.displayName}
              email={user?.email}
              size="lg"
            />
          </View>

          <View style={styles.welcomeInfo}>
            <View style={styles.badgeRow}>
              <Badge role={role} />
              <View
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: colors.successBg, borderRadius: radii.full },
                ]}
              >
                <Text style={[styles.verifiedText, { color: colors.success }]}>
                  ✓ Domain Verified
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.welcomeTitle,
                typography.h1,
                { color: colors.textPrimary, marginTop: spacing.xs },
              ]}
            >
              Welcome back, {user?.displayName || 'HB+ Member'}!
            </Text>
            <Text
              style={[
                styles.welcomeSubtitle,
                typography.subtitle,
                { color: colors.textSecondary },
              ]}
            >
              {user?.email}
            </Text>
          </View>

          <View style={[styles.welcomeActions, !isWide && styles.welcomeActionsMobile]}>
            {isAdmin && (
              <Button
                title="Admin Console"
                variant="primary"
                onPress={() => router.push('/admin')}
                style={styles.actionBtn}
              />
            )}
            <Button
              title="Sign Out"
              variant="outline"
              loading={isLoading}
              onPress={signOut}
              style={styles.actionBtn}
            />
          </View>
        </View>
      </Card>

      {/* Responsive Grid Section */}
      <View style={[styles.grid, isWide ? styles.gridWide : styles.gridNarrow]}>
        {/* Account Details Card */}
        <Card style={[styles.gridCard, isWide && styles.gridCardHalf]}>
          <Text style={[styles.cardTitle, typography.h3, { color: colors.textPrimary }]}>
            Account & Identity
          </Text>
          <Text
            style={[
              styles.cardDescription,
              typography.caption,
              { color: colors.textMuted, marginBottom: spacing.md },
            ]}
          >
            Google Workspace authenticated credentials
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, typography.body, { color: colors.textSecondary }]}>
              User ID
            </Text>
            <Text
              style={[styles.infoValue, typography.bodyBold, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {user?.uid}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}>
            <Text style={[styles.infoLabel, typography.body, { color: colors.textSecondary }]}>
              Email Address
            </Text>
            <Text style={[styles.infoValue, typography.bodyBold, { color: colors.textPrimary }]}>
              {user?.email}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}>
            <Text style={[styles.infoLabel, typography.body, { color: colors.textSecondary }]}>
              Account Role
            </Text>
            <Badge role={role} />
          </View>

          <View style={[styles.infoRow, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}>
            <Text style={[styles.infoLabel, typography.body, { color: colors.textSecondary }]}>
              Member Since
            </Text>
            <Text style={[styles.infoValue, typography.body, { color: colors.textSecondary }]}>
              {formatDate(user?.createdAt)}
            </Text>
          </View>
        </Card>

        {/* Session & Security Card */}
        <Card style={[styles.gridCard, isWide && styles.gridCardHalf]}>
          <Text style={[styles.cardTitle, typography.h3, { color: colors.textPrimary }]}>
            Security & Defense in Depth
          </Text>
          <Text
            style={[
              styles.cardDescription,
              typography.caption,
              { color: colors.textMuted, marginBottom: spacing.md },
            ]}
          >
            Active protection layers and session state
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, typography.body, { color: colors.textSecondary }]}>
              Allowed Domain
            </Text>
            <Text style={[styles.infoValue, typography.bodyBold, { color: colors.accent }]}>
              @{allowedDomain}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}>
            <Text style={[styles.infoLabel, typography.body, { color: colors.textSecondary }]}>
              Last Sign-In
            </Text>
            <Text style={[styles.infoValue, typography.body, { color: colors.textSecondary }]}>
              {formatDate(user?.lastLoginAt)}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}>
            <Text style={[styles.infoLabel, typography.body, { color: colors.textSecondary }]}>
              Storage Strategy
            </Text>
            <Text style={[styles.infoValue, typography.body, { color: colors.textSecondary }]}>
              Encrypted / Secure
            </Text>
          </View>

          <View style={[styles.infoRow, { borderTopColor: colors.borderSubtle, borderTopWidth: 1 }]}>
            <Text style={[styles.infoLabel, typography.body, { color: colors.textSecondary }]}>
              Firestore Rules
            </Text>
            <Text style={[styles.infoValue, typography.bodyBold, { color: colors.success }]}>
              Active Server Guard
            </Text>
          </View>
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    marginBottom: 20,
    width: '100%',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  welcomeRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    marginRight: 16,
    marginBottom: 8,
  },
  welcomeInfo: {
    flex: 1,
    minWidth: 240,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
  },
  welcomeTitle: {
    lineHeight: 32,
  },
  welcomeSubtitle: {
    marginTop: 2,
  },
  welcomeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeActionsMobile: {
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  actionBtn: {
    marginRight: 8,
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridWide: {
    flexDirection: 'row',
  },
  gridNarrow: {
    flexDirection: 'column',
  },
  gridCard: {
    width: '100%',
  },
  gridCardHalf: {
    flex: 1,
    minWidth: 320,
  },
  cardTitle: {
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    maxWidth: '60%',
    textAlign: 'right',
  },
});
