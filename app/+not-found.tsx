import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { useAppTheme } from '../src/theme';

export default function NotFoundScreen() {
  const { colors, spacing, typography } = useAppTheme();
  const router = useRouter();

  return (
    <ScreenContainer centerContent maxWidth={460}>
      <Card style={styles.card}>
        <Text style={[styles.code, { color: colors.accent }]}>404</Text>
        <Text style={[styles.title, typography.h2, { color: colors.textPrimary, marginTop: spacing.xs }]}>
          Page Not Found
        </Text>
        <Text
          style={[
            styles.description,
            typography.body,
            { color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.lg },
          ]}
        >
          The page or route you are looking for does not exist in the HB+ portal.
        </Text>

        <Button
          title="Return to Portal"
          variant="primary"
          onPress={() => router.replace('/dashboard')}
          style={{ width: '100%' }}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 32,
  },
  code: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
});
