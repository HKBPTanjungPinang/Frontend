/**
 * Color Palette - Modern, Professional Color System
 * Designed untuk aksesibilitas dan visual hierarchy yang jelas
 */

// ===== PRIMARY COLORS (Main brand identity) =====
// Using a modern, professional navy blue as primary
export const Primary = {
  50: '#f0f4ff',    // Very light
  100: '#e0e8ff',
  200: '#c2d5ff',
  300: '#a3c2ff',
  400: '#7aa5ff',
  500: '#5088ff',   // Primary brand color
  600: '#3d6ed9',
  700: '#2a4fab',
  800: '#1c3478',
  900: '#0f1f47',   // Very dark
} as const;

// ===== SECONDARY COLORS (Supporting/accent color) =====
// Using a warm teal for complementary color
export const Secondary = {
  50: '#f0fffe',
  100: '#e0fdfd',
  200: '#c1fafb',
  300: '#a2f7f9',
  400: '#83f5f6',
  500: '#64f2f4',   // Secondary accent
  600: '#4dd4d7',
  700: '#36b6ba',
  800: '#1f989c',
  900: '#087a7e',
} as const;

// ===== SUCCESS COLORS =====
export const Success = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',   // Success color
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#145231',
} as const;

// ===== ERROR/DANGER COLORS =====
export const Error = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',   // Error color
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
} as const;

// ===== WARNING COLORS =====
export const Warning = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',   // Warning color
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
} as const;

// ===== INFO/INFORMATIVE COLORS =====
export const Info = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',   // Info color
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c2d6b',
} as const;

// ===== NEUTRAL/GRAYSCALE =====
// For text, backgrounds, borders, and UI elements
export const Neutral = {
  0: '#ffffff',     // Pure white
  50: '#f9fafb',    // Almost white
  100: '#f3f4f6',
  150: '#eeeff2',   // Light gray (input backgrounds)
  200: '#e5e7eb',   // Light border
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',   // Dark gray
  850: '#1a1f2e',   // Darker gray
  900: '#111827',   // Almost black
  950: '#030712',   // Pure black
} as const;

// ===== SEMANTIC COLORS (Context-specific) =====
export const Semantic = {
  surface: Neutral[0],           // Main background
  surfaceSecondary: Neutral[50],
  surfaceTertiary: Neutral[100],
  
  text: Neutral[900],            // Main text
  textSecondary: Neutral[600],
  textTertiary: Neutral[500],
  textDisabled: Neutral[400],
  
  textInverse: Neutral[0],       // Text on dark backgrounds
  textInverseSecondary: Neutral[200],
  
  border: Neutral[200],          // Default border
  borderLight: Neutral[150],     // Light border
  borderDark: Neutral[300],
  
  divider: Neutral[200],
  
  shadow: Neutral[900],          // For shadows
  overlay: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
} as const;

// ===== LIGHT MODE PALETTE =====
export const ColorSchemeLight = {
  // UI Colors
  background: Neutral[0],
  backgroundSecondary: Neutral[50],
  backgroundTertiary: Neutral[100],
  
  // Text Colors
  text: Neutral[900],
  textSecondary: Neutral[600],
  textTertiary: Neutral[500],
  textDisabled: Neutral[400],
  
  // Component Colors
  surface: Neutral[0],
  surfaceAlt: Neutral[50],
  card: Neutral[0],
  cardAlt: Neutral[50],
  
  // Border & Divider
  border: Neutral[200],
  borderLight: Neutral[150],
  divider: Neutral[100],
  
  // Interactive
  primary: Primary[500],
  primaryLight: Primary[50],
  primaryDark: Primary[900],
  
  secondary: Secondary[500],
  secondaryLight: Secondary[50],
  secondaryDark: Secondary[900],
  
  // Feedback
  success: Success[500],
  successLight: Success[50],
  successDark: Success[900],
  
  error: Error[500],
  errorLight: Error[50],
  errorDark: Error[900],
  
  warning: Warning[500],
  warningLight: Warning[50],
  warningDark: Warning[900],
  
  info: Info[500],
  infoLight: Info[50],
  infoDark: Info[900],
  
  // Status
  disabled: Neutral[300],
  muted: Neutral[400],
  
  // Special
  overlay: 'rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(0, 0, 0, 0.32)',
} as const;

// ===== DARK MODE PALETTE =====
export const ColorSchemeDark = {
  // UI Colors
  background: Neutral[900],
  backgroundSecondary: Neutral[850],
  backgroundTertiary: Neutral[800],
  
  // Text Colors
  text: Neutral[50],
  textSecondary: Neutral[300],
  textTertiary: Neutral[400],
  textDisabled: Neutral[500],
  
  // Component Colors
  surface: Neutral[800],
  surfaceAlt: Neutral[900],
  card: Neutral[850],
  cardAlt: Neutral[900],
  
  // Border & Divider
  border: Neutral[700],
  borderLight: Neutral[800],
  divider: Neutral[700],
  
  // Interactive
  primary: Primary[400],
  primaryLight: Primary[500],
  primaryDark: Primary[600],
  
  secondary: Secondary[400],
  secondaryLight: Secondary[500],
  secondaryDark: Secondary[600],
  
  // Feedback
  success: Success[400],
  successLight: Success[500],
  successDark: Success[600],
  
  error: Error[400],
  errorLight: Error[500],
  errorDark: Error[600],
  
  warning: Warning[400],
  warningLight: Warning[500],
  warningDark: Warning[600],
  
  info: Info[400],
  infoLight: Info[500],
  infoDark: Info[600],
  
  // Status
  disabled: Neutral[600],
  muted: Neutral[500],
  
  // Special
  overlay: 'rgba(0, 0, 0, 0.6)',
  scrim: 'rgba(0, 0, 0, 0.64)',
} as const;

// ===== GRADIENT PRESETS =====
export const Gradients = {
  // Primary brand gradient
  primaryGradient: {
    colors: [Primary[600], Primary[400]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Secondary brand gradient
  secondaryGradient: {
    colors: [Secondary[400], Secondary[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Success gradient
  successGradient: {
    colors: [Success[400], Success[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Header gradient (professional)
  headerGradient: {
    colors: [Primary[700], Primary[500]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Subtle gradient for backgrounds
  bgGradient: {
    colors: [Neutral[50], Neutral[100]],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;

// ===== THEME HELPER =====
// Use this to get the right colors based on color scheme
export const getColors = (isDark: boolean) => {
  return isDark ? ColorSchemeDark : ColorSchemeLight;
};
