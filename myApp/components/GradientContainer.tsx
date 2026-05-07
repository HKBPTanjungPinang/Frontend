/**
 * GradientContainer Component - Reusable gradient background container
 * Supports light/dark mode and various gradient presets
 */

import { Gradients } from '@/constants/colors';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface GradientContainerProps {
  children: ReactNode;
  preset?: 'primary' | 'secondary' | 'success' | 'header' | 'background' | 'custom';
  customColors?: string[];
  style?: ViewStyle;
  padding?: number;
}

export default function GradientContainer({
  children,
  preset = 'primary',
  customColors,
  style,
  padding,
}: GradientContainerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  let gradientColors: string[] = [];
  let gradientStart = { x: 0, y: 0 };
  let gradientEnd = { x: 1, y: 1 };

  if (customColors) {
    gradientColors = customColors;
  } else {
    switch (preset) {
      case 'primary':
        gradientColors = Gradients.primaryGradient.colors;
        gradientStart = Gradients.primaryGradient.start;
        gradientEnd = Gradients.primaryGradient.end;
        break;
      case 'secondary':
        gradientColors = Gradients.secondaryGradient.colors;
        gradientStart = Gradients.secondaryGradient.start;
        gradientEnd = Gradients.secondaryGradient.end;
        break;
      case 'success':
        gradientColors = Gradients.successGradient.colors;
        gradientStart = Gradients.successGradient.start;
        gradientEnd = Gradients.successGradient.end;
        break;
      case 'header':
        gradientColors = Gradients.headerGradient.colors;
        gradientStart = Gradients.headerGradient.start;
        gradientEnd = Gradients.headerGradient.end;
        break;
      case 'background':
        gradientColors = Gradients.bgGradient.colors;
        gradientStart = Gradients.bgGradient.start;
        gradientEnd = Gradients.bgGradient.end;
        break;
      case 'custom':
      default:
        gradientColors = [colors.surface, colors.surface];
        break;
    }
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={gradientStart}
      end={gradientEnd}
      style={[
        styles.container,
        padding && { padding },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
