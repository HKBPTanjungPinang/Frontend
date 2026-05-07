/**
 * Utility Functions for Styling
 * Helper functions untuk styling yang lebih konsisten
 */

import { Neutral } from './colors';
import { BorderRadius, FontSize, FontWeight, Shadows, Spacing } from './designTokens';

/**
 * Membuat responsive padding berdasarkan screen size
 */
export const getResponsivePadding = (screenWidth: number) => {
  if (screenWidth < 360) return Spacing.md;
  if (screenWidth < 480) return Spacing.lg;
  return Spacing.xl;
};

/**
 * Membuat responsive font size
 */
export const getResponsiveFontSize = (screenWidth: number, baseSize: number) => {
  const scale = screenWidth / 375; // Basis dari iPhone 8
  return Math.round(baseSize * scale);
};

/**
 * Membuat shadow berdasarkan elevation level
 */
export const getShadow = (elevation: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
  const shadowMap: Record<string, any> = {
    xs: Shadows.xs,
    sm: Shadows.sm,
    md: Shadows.md,
    lg: Shadows.lg,
    xl: Shadows.xl,
  };
  return shadowMap[elevation] || Shadows.md;
};

/**
 * Membuat spacing value
 */
export const getSpacing = (multiplier: number = 1) => {
  return Spacing.lg * multiplier;
};

/**
 * Membuat border radius berdasarkan jenis
 */
export const getBorderRadius = (type: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md') => {
  const radiusMap: Record<string, number> = {
    xs: BorderRadius.xs,
    sm: BorderRadius.sm,
    md: BorderRadius.md,
    lg: BorderRadius.lg,
    xl: BorderRadius.xl,
    full: BorderRadius.full,
  };
  return radiusMap[type] || BorderRadius.md;
};

/**
 * Format typography
 */
export const getTypography = (
  fontSize: number = FontSize.base,
  fontWeight: keyof typeof FontWeight = 'normal',
  lineHeight: number = 1.5
) => {
  return {
    fontSize,
    fontWeight: FontWeight[fontWeight],
    lineHeight: fontSize * lineHeight,
  };
};

/**
 * Membuat placeholder color yang konsisten
 */
export const getPlaceholderColor = (isDark: boolean) => {
  return isDark ? Neutral[600] : Neutral[400];
};

/**
 * Membuat opacity berdasarkan state
 */
export const getOpacity = (state: 'normal' | 'pressed' | 'disabled' = 'normal') => {
  const opacityMap: Record<string, number> = {
    normal: 1,
    pressed: 0.7,
    disabled: 0.5,
  };
  return opacityMap[state] || 1;
};

/**
 * Truncate text dengan ellipsis
 */
export const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

/**
 * Format tanggal ke format lokal Indonesia
 */
export const formatDateIndonesia = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return dateObj.toLocaleDateString('id-ID', options);
};

/**
 * Format waktu
 */
export const formatTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Interpolate color (untuk animasi)
 */
export const interpolateColor = (
  inputRange: number[],
  outputRange: string[],
  value: number
): string => {
  if (inputRange.length !== outputRange.length) {
    console.warn('Input and output ranges must have the same length');
    return outputRange[0];
  }

  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) {
    return outputRange[outputRange.length - 1];
  }

  for (let i = 0; i < inputRange.length - 1; i++) {
    const x0 = inputRange[i];
    const x1 = inputRange[i + 1];
    if (value >= x0 && value <= x1) {
      const ratio = (value - x0) / (x1 - x0);
      // Simplified - untuk production use Animated API
      return outputRange[i];
    }
  }

  return outputRange[0];
};
