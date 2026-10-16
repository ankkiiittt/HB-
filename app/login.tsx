import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { useAuth, getAllowedDomain, ACCESS_RESTRICTED_MESSAGE } from '../src/auth';
import { useAppTheme } from '../src/theme';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { ErrorBanner } from '../src/components/ErrorBanner';

export default function LoginScreen() {
  const { signIn, isLoading, error, setError, clearError } = useAuth();
  const { colors, spacing, typography, radii, isDark } = useAppTheme();
  const allowedDomain = getAllowedDomain();

  const [inputEmail, setInputEmail] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Validates the email domain BEFORE ever opening Google OAuth or asking for password
  const handleEmailSubmit = async () => {
    clearError();
    const cleaned = inputEmail.trim().toLowerCase();

    if (!cleaned) {
      setError('Please enter your official work email address.');
      return;
    }

    const atIndex = cleaned.indexOf('@');
    const lastAtIndex = cleaned.lastIndexOf('@');

    // Strict domain check: must contain exactly one @ and match allowedDomain
    if (atIndex <= 0 || atIndex !== lastAtIndex || cleaned.substring(atIndex + 1) !== allowedDomain) {
      // Rejects immediately on the client - password page will NEVER be opened!
      setError(ACCESS_RESTRICTED_MESSAGE);
      return;
    }

    // Domain matches allowedDomain! Proceed to Google OAuth with email pre-filled
    await signIn(cleaned);
  };

  // Direct one-click Google Sign-In
  const handleDirectGoogleSignIn = async () => {
    clearError();
    await signIn();
  };

  return (
    <ScreenContainer scrollable centerContent maxWidth={460}>
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
            title="Access Restricted"
          />
        )}

        {/* Official Email Input Form (Validates domain BEFORE password) */}
        <View style={[styles.formContainer, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.inputLabel,
              typography.bodyBold,
              { color: colors.textPrimary, marginBottom: spacing.xs },
            ]}
          >
            Official Workspace Email
          </Text>

          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: isInputFocused ? colors.accent : colors.border,
                borderRadius: radii.md,
                color: colors.textPrimary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
              },
              Platform.OS === 'web' &&
                isInputFocused && {
                  outlineColor: colors.accent,
                  outlineWidth: 2,
                  outlineStyle: 'solid',
                } as any,
            ]}
            placeholder={`name@${allowedDomain}`}
            placeholderTextColor={colors.textMuted}
            value={inputEmail}
            onChangeText={(text) => {
              setInputEmail(text);
              if (error) clearError();
            }}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="go"
            onSubmitEditing={handleEmailSubmit}
          />

          <Button
            title="Next"
            variant="primary"
            loading={isLoading}
            onPress={handleEmailSubmit}
            style={{ marginTop: spacing.md }}
          />
        </View>

        {/* Divider */}
        <View style={[styles.dividerRow, { marginVertical: spacing.lg }]}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, typography.caption, { color: colors.textMuted }]}>
            OR
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Direct Google OAuth Action Button */}
        <View style={styles.actionContainer}>
          <Button
            title="Sign in with Google"
            variant="google"
            loading={isLoading}
            onPress={handleDirectGoogleSignIn}
            accessibilityLabel="Sign in with your Google account"
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
            accounts are authorized. External accounts will be rejected.
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
    maxWidth: 340,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
  },
  textInput: {
    borderWidth: 1,
    fontSize: 15,
    minHeight: 48,
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontWeight: '700',
    letterSpacing: 1,
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
