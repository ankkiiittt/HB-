import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';

interface ErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
  title?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
  title = 'Authentication Error',
}) => {
  const { colors, spacing, radii, typography } = useAppTheme();

  if (!message) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.dangerBg,
          borderColor: colors.dangerBorder,
          borderRadius: radii.md,
          padding: spacing.md,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.contentRow}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.dangerBorder, borderRadius: radii.full },
          ]}
        >
          <Text style={[styles.iconText, { color: colors.danger }]}>!</Text>
        </View>

        <View style={styles.textContainer}>
          {title && (
            <Text
              style={[
                styles.title,
                typography.bodyBold,
                { color: colors.dangerText, marginBottom: 2 },
              ]}
            >
              {title}
            </Text>
          )}
          <Text style={[styles.message, typography.body, { color: colors.dangerText }]}>
            {message}
          </Text>
        </View>

        {onDismiss && (
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss error message"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={({ pressed }) => [
              styles.dismissButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={[styles.dismissText, { color: colors.dangerText }]}>×</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
    marginVertical: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  iconText: {
    fontSize: 13,
    fontWeight: '800',
  },
  textContainer: {
    flex: 1,
    paddingRight: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  dismissButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 20,
  },
});
