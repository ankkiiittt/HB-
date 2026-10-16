import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useAuth, getAllowedDomain } from '../src/auth';
import { useAppTheme } from '../src/theme';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { ErrorBanner } from '../src/components/ErrorBanner';

export default function LoginScreen() {
  const { signIn, isLoading, error, clearError } = useAuth();
  const { colors, spacing, typography, radii } = useAppTheme();
  const allowedDomain = getAllowedDomain();

  const handleSignIn = async () => {
    await signIn();
  };

  return (
    <ScreenContainer scrollable centerContent maxWidth={440}>
      <Card style={styles.card}>
        {/* App Wordmark & Branding */}
        <View style={styles.brandContainer}>
          <View
            style={[
              styles.logoBadge,
              {
                backgroundColor: colors.accent,
                borderRadius: radii.md,
              },
            ]}
          >
            <Text style={styles.logoText}>HB+</Text>
          </View>
          <Text
            style={[
              styles.brandName,
              typography.h1,
              { color: colors.textPrimary, marginTop: spacing.md },
            ]}
          >
            HB+ Portal
          </Text>
          <Text
            style={[
              styles.headline,
              typography.subtitle,
              { color: colors.textSecondary, marginTop: spacing.xs },
            ]}
          >
            Secure unified workspace for HB+ team members and coaches
          </Text>
        </View>

        {/* Inline Dismissible Error Banner */}
        {error && (
          <ErrorBanner
            message={error}
            onDismiss={clearError}
            title={error.includes('Access restricted') ? 'Access Denied' : 'Sign-In Error'}
          />
        )}

        {/* Google OAuth Action Button */}
        <View style={[styles.actionContainer, { marginTop: spacing.lg }]}>
          <Button
            title="Sign in with Google"
            variant="google"
            loading={isLoading}
            onPress={handleSignIn}
            accessibilityLabel="Sign in with your official Google account"
            testID="google-signin-button"
            style={styles.googleButton}
          />
        </View>

        {/* Domain Helper Notice */}
        <View
          style={[
            styles.noticeBox,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.borderSubtle,
              borderRadius: radii.sm,
              marginTop: spacing.xl,
            },
          ]}
        >
          <Text style={[styles.noticeText, typography.caption, { color: colors.textMuted }]}>
            Domain Restricted • Only official{' '}
            <Text style={{ fontWeight: '700', color: colors.textSecondary }}>
              @{allowedDomain}
            </Text>{' '}
            Google accounts are authorized. External accounts will be automatically rejected.
          </Text>
        </View>

        {/* Security & Multi-platform Footer */}
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, typography.caption, { color: colors.textMuted }]}>
            Protected by multi-tier defense in depth • Firebase Auth & Security Rules
          </Text>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logoBadge: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.35)',
      },
      default: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandName: {
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  headline: {
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  actionContainer: {
    width: '100%',
  },
  googleButton: {
    width: '100%',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  noticeBox: {
    padding: 12,
    borderWidth: 1,
    width: '100%',
  },
  noticeText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  footerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
  },
});
