import React, { useState } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { useAppTheme } from '../theme';
import { GoogleIcon } from './GoogleIcon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'google' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}) => {
  const { colors, spacing, radii, typography, isDark } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || loading;

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    let bg = colors.accent;
    let borderCol = 'transparent';
    let borderWidth = 0;

    switch (variant) {
      case 'google':
        bg = isDark ? '#1E293B' : '#FFFFFF';
        borderCol = isDark ? '#334155' : '#E2E8F0';
        borderWidth = 1;
        break;
      case 'secondary':
        bg = colors.surfaceSubtle;
        borderCol = colors.border;
        borderWidth = 1;
        break;
      case 'outline':
        bg = 'transparent';
        borderCol = colors.border;
        borderWidth = 1;
        break;
      case 'ghost':
        bg = 'transparent';
        break;
      case 'danger':
        bg = colors.danger;
        break;
      case 'primary':
      default:
        bg = colors.accent;
        break;
    }

    const base: ViewStyle = {
      backgroundColor: bg,
      borderColor: borderCol,
      borderWidth,
      borderRadius: radii.md,
      minHeight: 48,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
      // Focus ring on web
      ...(isFocused && Platform.OS === 'web'
        ? {
            outlineColor: colors.accent,
            outlineWidth: 2,
            outlineStyle: 'solid',
          }
        : {}),
    };

    return base;
  };

  const getTextStyle = (): TextStyle => {
    let color = colors.accentText;

    switch (variant) {
      case 'google':
        color = colors.textPrimary;
        break;
      case 'secondary':
      case 'outline':
      case 'ghost':
        color = colors.textPrimary;
        break;
      case 'danger':
        color = '#FFFFFF';
        break;
      case 'primary':
      default:
        color = colors.accentText;
        break;
    }

    return {
      ...typography.button,
      color,
      textAlign: 'center',
    };
  };

  const renderIcon = () => {
    if (loading) {
      const spinnerColor =
        variant === 'google' || variant === 'secondary' || variant === 'outline' || variant === 'ghost'
          ? colors.textPrimary
          : '#FFFFFF';
      return <ActivityIndicator size="small" color={spinnerColor} style={styles.spinner} />;
    }

    if (variant === 'google') {
      return (
        <View style={styles.iconContainer}>
          <GoogleIcon size={18} />
        </View>
      );
    }

    if (leftIcon) {
      return <View style={styles.iconContainer}>{leftIcon}</View>;
    }

    return null;
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={({ pressed }) => [getContainerStyle(pressed), style]}
    >
      {renderIcon()}
      <Text style={[getTextStyle(), textStyle]}>
        {loading ? (variant === 'google' ? 'Signing in...' : 'Please wait...') : title}
      </Text>
      {!loading && rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconContainer: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 10,
  },
});
