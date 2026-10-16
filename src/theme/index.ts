import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './colors';
import { spacing, Spacing } from './spacing';
import { typography, Typography } from './typography';
import { radii, Radii } from './radii';

export interface Theme {
  colors: ThemeColors;
  spacing: Spacing;
  typography: Typography;
  radii: Radii;
  isDark: boolean;
}

export function useAppTheme(): Theme {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colors: isDark ? darkColors : lightColors,
    spacing,
    typography,
    radii,
    isDark,
  };
}

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './radii';
