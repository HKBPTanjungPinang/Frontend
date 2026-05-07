/**
 * Card Component - Reusable card with consistent styling and elevation
 * Supports different variants, sizes, and interaction states
 */

import { BorderRadius, Shadows, Spacing } from '@/constants/designTokens';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface CardProps {
  onPress?: () => void;
  children: ReactNode;
  variant?: 'elevated' | 'filled' | 'outlined';
  padding?: number;
  margin?: number;
  style?: ViewStyle;
  disabled?: boolean;
  activeOpacity?: number;
}

export default function Card({
  onPress,
  children,
  variant = 'elevated',
  padding = Spacing.lg,
  margin = Spacing.md,
  style,
  disabled = false,
  activeOpacity = 0.7,
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const cardStyles = getCardStyles(variant, colors);

  const content = (
    <View
      style={[
        styles.card,
        cardStyles,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={{ margin }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ margin }}>
      {content}
    </View>
  );
}

function getCardStyles(variant: string, colors: any) {
  switch (variant) {
    case 'filled':
      return {
        backgroundColor: colors.backgroundSecondary,
        borderWidth: 0,
        ...Shadows.xs,
      };
    case 'outlined':
      return {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...Shadows.none,
      };
    case 'elevated':
    default:
      return {
        backgroundColor: colors.surface,
        borderWidth: 0,
        ...Shadows.md,
      };
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
});
