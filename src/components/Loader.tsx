import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Loading...',
  fullScreen = true,
}) => {
  const { colors, spacing, typography, radii } = useAppTheme();

  const content = (
    <View style={styles.content}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.xl,
            padding: spacing.xl,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
        {message ? (
          <Text
            style={[
              styles.message,
              typography.body,
              { color: colors.textSecondary, marginTop: spacing.md },
            ]}
          >
            {message}
          </Text>
        ) : null}
      </View>
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={[styles.fullScreen, { backgroundColor: colors.background }]}
        accessibilityRole="progressbar"
        accessibilityLabel={message}
      >
        {content}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minWidth: 160,
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
  },
});
