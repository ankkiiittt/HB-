import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  centerContent?: boolean;
  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  centerContent = false,
  maxWidth,
  style,
  contentContainerStyle,
}) => {
  const { colors, spacing } = useAppTheme();

  const innerStyle: ViewStyle = {
    flex: 1,
    width: '100%',
    maxWidth: maxWidth || undefined,
    alignSelf: maxWidth ? 'center' : undefined,
    justifyContent: centerContent ? 'center' : undefined,
    padding: spacing.base,
  };

  const content = scrollable ? (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={[
        styles.scrollContent,
        centerContent && styles.centered,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={innerStyle}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.nonScrollContent, centerContent && styles.centered, innerStyle, contentContainerStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
        style,
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
  nonScrollContent: {
    flex: 1,
    width: '100%',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
