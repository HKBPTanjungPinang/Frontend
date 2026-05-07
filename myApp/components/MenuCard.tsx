/**
 * MenuCard Component - Specialized card for menu items with icon and text
 * Used for dashboard menus and navigation items
 */

import { BorderRadius, FontSize, Shadows, Size, Spacing } from '@/constants/designTokens';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

interface MenuCardProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  subtitle?: string;
  style?: ViewStyle;
  gradient?: { colors: string[]; start: any; end: any };
  disabled?: boolean;
}

export default function MenuCard({
  icon,
  label,
  onPress,
  subtitle,
  style,
  gradient,
  disabled = false,
}: MenuCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const cardContent = (
    <View style={styles.content}>
      <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={[styles.label, { color: colors.text }]}>
          {label}
        </ThemedText>
        {subtitle && (
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>
    </View>
  );

  if (gradient) {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.cardContainer, style]}
      >
        <LinearGradient
          colors={gradient.colors}
          start={gradient.start}
          end={gradient.end}
          style={[styles.gradientCard, Shadows.md]}
        >
          {cardContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.surface,
          ...Shadows.md,
        },
        style,
      ]}
    >
      {cardContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  gradientCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    minHeight: 120,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: Size.iconXxl,
    height: Size.iconXxl,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
  },
});
