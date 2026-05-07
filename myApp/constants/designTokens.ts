/**
 * Design Tokens - Centralized design system
 * Gunakan constants ini di semua komponen untuk konsistensi visual
 */

// ===== SPACING SCALE (Multiples of 4px) =====
export const Spacing = {
  xs: 4,      // Extra small
  sm: 8,      // Small
  md: 12,     // Medium
  lg: 16,     // Large
  xl: 20,     // Extra large
  xxl: 24,    // 2X Large
  xxxl: 32,   // 3X Large
  xxxxl: 40,  // 4X Large
} as const;

// ===== BORDER RADIUS =====
export const BorderRadius = {
  none: 0,
  xs: 4,      // Extra small
  sm: 8,      // Small for chips, small buttons
  md: 12,     // Medium for cards, inputs
  lg: 16,     // Large for containers
  xl: 20,     // Extra large
  full: 999,  // Fully rounded (circles, pills)
} as const;

// ===== TYPOGRAPHY =====
export const FontSize = {
  xs: 12,     // Extra small - captions
  sm: 14,     // Small - labels, helper text
  base: 16,   // Base/normal - body text
  md: 18,     // Medium - subheadings
  lg: 20,     // Large - section titles
  xl: 24,     // Extra large - headings
  xxl: 28,    // 2X large - main headings
  xxxl: 32,   // 3X large - hero titles
} as const;

export const FontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// ===== LINE HEIGHT =====
export const LineHeight = {
  tight: 1.2,      // Headings
  normal: 1.5,     // Body text
  relaxed: 1.75,   // Comfortable reading
} as const;

// ===== SHADOWS (iOS style) =====
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// ===== ANIMATION DURATIONS (milliseconds) =====
export const AnimationDuration = {
  fast: 100,
  base: 200,
  normal: 300,
  slow: 500,
  slowest: 1000,
} as const;

// ===== SIZE TOKENS =====
export const Size = {
  // Touch target minimums (48px recommended)
  touchMinHeight: 48,
  touchMinWidth: 48,

  // Icon sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 40,
  iconXxl: 56,

  // Avatar sizes
  avatarXs: 24,
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 56,
  avatarXl: 80,

  // Container sizes
  inputHeight: 48,
  buttonHeight: 48,
  buttonHeightSmall: 40,
  buttonHeightLarge: 56,

  // Max widths
  maxContentWidth: 1200,
  containerPadding: Spacing.lg,
} as const;

// ===== Z-INDEX STACK =====
export const ZIndex = {
  hidden: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  notification: 1070,
} as const;

// ===== TRANSITION/ANIMATION PRESETS =====
export const TransitionPresets = {
  none: {
    duration: 0,
  },
  fast: {
    duration: AnimationDuration.fast,
  },
  smooth: {
    duration: AnimationDuration.base,
  },
  default: {
    duration: AnimationDuration.normal,
  },
  slow: {
    duration: AnimationDuration.slow,
  },
} as const;
