import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';
import type { UserRole } from '../types/auth';

interface BadgeProps {
  label?: string;
  role?: UserRole;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ label, role, variant }) => {
  const { colors, spacing, radii, typography } = useAppTheme();

  // If role is passed, map automatically
  const activeVariant =
    variant || (role === 'admin' ? 'primary' : 'neutral');
  const displayLabel = label || (role === 'admin' ? 'Admin' : 'Member');

  let bg = colors.surfaceSubtle;
  let textCol = colors.textSecondary;
  let borderCol = colors.border;

  switch (activeVariant) {
    case 'primary':
      bg = colors.accentLight;
      textCol = colors.accent;
      borderCol = colors.accent;
      break;
    case 'success':
      bg = colors.successBg;
      textCol = colors.success;
      borderCol = colors.success;
      break;
    case 'warning':
      bg = colors.warningBg;
      textCol = colors.warning;
      borderCol = colors.warning;
      break;
    case 'danger':
      bg = colors.dangerBg;
      textCol = colors.danger;
      borderCol = colors.dangerBorder;
      break;
    case 'neutral':
    default:
      bg = colors.surfaceSubtle;
      textCol = colors.textSecondary;
      borderCol = colors.border;
      break;
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: borderCol,
          borderRadius: radii.full,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: spacing.xs,
        },
      ]}
    >
      <Text style={[styles.text, typography.caption, { color: textCol }]}>
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
});
