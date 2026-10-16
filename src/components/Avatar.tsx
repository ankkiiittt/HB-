import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';

interface AvatarProps {
  photoURL?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 32,
  md: 44,
  lg: 64,
  xl: 88,
};

const fontSizeMap = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Avatar: React.FC<AvatarProps> = ({
  photoURL,
  name,
  email,
  size = 'md',
}) => {
  const { colors, radii } = useAppTheme();
  const [hasError, setHasError] = useState(false);

  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];

  const getInitials = (): string => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (email && email.trim().length > 0) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'HB';
  };

  const showImage = photoURL && !hasError;

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: radii.full,
          backgroundColor: colors.accentLight,
          borderColor: colors.border,
          borderWidth: 1.5,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={name ? `${name}'s profile avatar` : 'Profile avatar'}
    >
      {showImage ? (
        <Image
          source={{ uri: photoURL }}
          style={{ width: dimension, height: dimension, borderRadius: radii.full }}
          onError={() => setHasError(true)}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize, color: colors.accent }]}>
          {getInitials()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
