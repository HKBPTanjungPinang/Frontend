/**
 * Button Component - Reusable button with multiple variants and sizes
 * Supports loading, disabled, and custom styling
 */

import { Gradients } from '@/constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadows, Size, Spacing } from '@/constants/designTokens';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { ThemedText } from './themed-text';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  useGradient?: boolean;
}

export default function Button({
  onPress,
  label,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
  useGradient = true,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const isDisabled = disabled || loading;
  const buttonStyles = getButtonStyles(variant, size, colors, isDisabled);
  const buttonHeight = getButtonHeight(size);

  const content = (
    <View style={[buttonStyles.container, fullWidth && { width: '100%' }, style]}>
      {icon && <View style={{ marginRight: Spacing.sm }}>{icon}</View>}
      {loading ? (
        <ActivityIndicator color={buttonStyles.textColor} size="small" />
      ) : (
        <ThemedText
          style={[
            styles.text,
            { color: buttonStyles.textColor, fontSize: buttonStyles.fontSize },
            textStyle,
          ]}
        >
          {label}
        </ThemedText>
      )}
    </View>
  );

  // Use gradient for primary button
  if (variant === 'primary' && useGradient && !isDisabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[{ height: buttonHeight }, style]}
      >
        <LinearGradient
          colors={Gradients.primaryGradient.colors}
          start={Gradients.primaryGradient.start}
          end={Gradients.primaryGradient.end}
          style={[buttonStyles.container, { height: buttonHeight }]}
        >
          {icon && <View style={{ marginRight: Spacing.sm }}>{icon}</View>}
          {loading ? (
            <ActivityIndicator color={buttonStyles.textColor} size="small" />
          ) : (
            <ThemedText
              style={[
                styles.text,
                { color: buttonStyles.textColor, fontSize: buttonStyles.fontSize },
                textStyle,
              ]}
            >
              {label}
            </ThemedText>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[{ height: buttonHeight }, style]}
    >
      {content}
    </TouchableOpacity>
  );
}

function getButtonStyles(variant: string, size: string, colors: any, isDisabled: boolean) {
  const sizeConfig: Record<string, any> = {
    small: {
      paddingHorizontal: Spacing.md,
      fontSize: FontSize.sm,
    },
    medium: {
      paddingHorizontal: Spacing.lg,
      fontSize: FontSize.base,
    },
    large: {
      paddingHorizontal: Spacing.xl,
      fontSize: FontSize.md,
    },
  };

  const variantConfigs: Record<string, any> = {
    primary: {
      backgroundColor: colors.primary,
      textColor: '#ffffff',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: colors.secondary,
      textColor: '#ffffff',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    success: {
      backgroundColor: colors.success,
      textColor: '#ffffff',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    error: {
      backgroundColor: colors.error,
      textColor: '#ffffff',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    warning: {
      backgroundColor: colors.warning,
      textColor: '#ffffff',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    info: {
      backgroundColor: colors.info,
      textColor: '#ffffff',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: colors.primary,
      borderColor: 'transparent',
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: colors.primary,
      borderColor: colors.primary,
      borderWidth: 2,
    },
  };

  const config = variantConfigs[variant] || variantConfigs.primary;
  const sizeStyle = sizeConfig[size] || sizeConfig.medium;

  if (isDisabled) {
    return {
      container: {
        backgroundColor: colors.textDisabled,
        borderColor: colors.border,
        borderWidth: 1,
        ...sizeStyle,
        ...Shadows.xs,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: BorderRadius.md,
      },
      textColor: colors.textTertiary,
      fontSize: sizeStyle.fontSize,
    };
  }

  return {
    container: {
      backgroundColor: config.backgroundColor,
      borderColor: config.borderColor,
      borderWidth: config.borderWidth,
      ...sizeStyle,
      ...Shadows.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: BorderRadius.md,
    },
    textColor: config.textColor,
    fontSize: sizeStyle.fontSize,
  };
}

function getButtonHeight(size: string): number {
  switch (size) {
    case 'small':
      return Size.buttonHeightSmall;
    case 'large':
      return Size.buttonHeightLarge;
    case 'medium':
    default:
      return Size.buttonHeight;
  }
}

const styles = StyleSheet.create({
  text: {
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
});
