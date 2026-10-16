import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  h1: {
    fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontFamily,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  } as TextStyle,
  h3: {
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,
  subtitle: {
    fontFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  } as TextStyle,
  body: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,
  bodyBold: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,
  caption: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  } as TextStyle,
  button: {
    fontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,
};

export type Typography = typeof typography;
