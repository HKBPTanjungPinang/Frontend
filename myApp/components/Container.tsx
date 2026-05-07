/**
 * Container Component - Wrapper untuk consistent padding dan styling
 */

import { BorderRadius, Spacing } from '@/constants/designTokens';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ContainerProps {
  children: ReactNode;
  padded?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
}

export default function Container({
  children,
  padded = true,
  style,
  backgroundColor,
}: ContainerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.container,
        padded && { padding: Spacing.lg },
        backgroundColor && { backgroundColor },
        !backgroundColor && { backgroundColor: colors.surface },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
  },
});
