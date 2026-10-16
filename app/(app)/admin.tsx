import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { RoleGuard } from '../../src/components/RoleGuard';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Card } from '../../src/components/Card';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { useAppTheme } from '../../src/theme';
import { listAllUsers } from '../../src/services/userService';
import { formatDate, formatRelativeTime } from '../../src/utils/formatDate';
import type { UserProfile } from '../../src/types/auth';

function AdminDirectory() {
  const { colors, spacing, typography, radii } = useAppTheme();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await listAllUsers();
      setUsers(data);
    } catch (err) {
      console.warn('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <ScreenContainer scrollable maxWidth={1100}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Text style={[styles.title, typography.h1, { color: colors.textPrimary }]}>
              Admin Directory
            </Text>
            <Badge label="Restricted" variant="danger" />
          </View>
          <Text
            style={[
              styles.subtitle,
              typography.subtitle,
              { color: colors.textSecondary, marginTop: spacing.xs },
            ]}
          >
            Authorized HB+ accounts and organizational roles
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Button
            title="Refresh"
            variant="secondary"
            loading={loading}
            onPress={fetchUsers}
            style={styles.refreshBtn}
          />
          <Button
            title="Back to Dashboard"
            variant="outline"
            onPress={() => router.push('/dashboard')}
            style={styles.backBtn}
          />
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Text style={[styles.metricLabel, typography.caption, { color: colors.textMuted }]}>
            TOTAL MEMBERS
          </Text>
          <Text style={[styles.metricValue, typography.h1, { color: colors.textPrimary }]}>
            {loading ? '-' : users.length}
          </Text>
        </Card>

        <Card style={styles.metricCard}>
          <Text style={[styles.metricLabel, typography.caption, { color: colors.textMuted }]}>
            ADMINISTRATORS
          </Text>
          <Text style={[styles.metricValue, typography.h1, { color: colors.accent }]}>
            {loading ? '-' : adminCount}
          </Text>
        </Card>

        <Card style={styles.metricCard}>
          <Text style={[styles.metricLabel, typography.caption, { color: colors.textMuted }]}>
            DOMAIN
          </Text>
          <Text style={[styles.metricValue, typography.h2, { color: colors.success }]}>
            @hbplus.fit
          </Text>
        </Card>
      </View>

      {/* Users List / Table */}
      <Card style={styles.tableCard}>
        <Text style={[styles.tableTitle, typography.h3, { color: colors.textPrimary, marginBottom: spacing.md }]}>
          Registered Users ({users.length})
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, typography.body, { color: colors.textSecondary, marginTop: spacing.md }]}>
              Loading organizational directory...
            </Text>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, typography.bodyBold, { color: colors.textPrimary }]}>
              No users registered yet
            </Text>
            <Text style={[styles.emptySubtitle, typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
              Signed-in @hbplus.fit team members will appear in this directory automatically.
            </Text>
          </View>
        ) : (
          <View style={styles.userList}>
            {users.map((item, index) => (
              <View
                key={item.uid || index.toString()}
                style={[
                  styles.userRow,
                  {
                    borderBottomColor: colors.borderSubtle,
                    borderBottomWidth: index === users.length - 1 ? 0 : 1,
                  },
                ]}
              >
                <View style={styles.userLeft}>
                  <Avatar
                    photoURL={item.photoURL}
                    name={item.displayName}
                    email={item.email}
                    size="md"
                  />
                  <View style={styles.userDetails}>
                    <Text
                      style={[
                        styles.userDisplayName,
                        typography.bodyBold,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {item.displayName || 'HB+ Member'}
                    </Text>
                    <Text
                      style={[styles.userEmail, typography.caption, { color: colors.textSecondary }]}
                    >
                      {item.email}
                    </Text>
                  </View>
                </View>

                <View style={styles.userRight}>
                  <View style={styles.badgeWrapper}>
                    <Badge role={item.role} />
                  </View>
                  <View style={styles.loginMeta}>
                    <Text style={[styles.lastLoginLabel, typography.caption, { color: colors.textMuted }]}>
                      Last active: {formatRelativeTime(item.lastLoginAt)}
                    </Text>
                    <Text style={[styles.createdLabel, typography.caption, { color: colors.textMuted }]}>
                      Created: {formatDate(item.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScreenContainer>
  );
}

export default function AdminScreen() {
  return (
    <RoleGuard allow={['admin']}>
      <AdminDirectory />
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshBtn: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  backBtn: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    minWidth: 160,
    padding: 16,
  },
  metricLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  metricValue: {
    marginTop: 6,
  },
  tableCard: {
    width: '100%',
  },
  tableTitle: {
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
  },
  emptySubtitle: {
    textAlign: 'center',
    maxWidth: 400,
  },
  userList: {
    width: '100%',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 220,
  },
  userDetails: {
    marginLeft: 12,
  },
  userDisplayName: {
    fontSize: 14,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
  },
  userRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  badgeWrapper: {
    minWidth: 70,
  },
  loginMeta: {
    alignItems: 'flex-end',
  },
  lastLoginLabel: {
    fontSize: 12,
  },
  createdLabel: {
    fontSize: 11,
  },
});
