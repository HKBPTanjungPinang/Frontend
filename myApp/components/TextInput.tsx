/**
 * TextInput Component - Reusable input with consistent styling
 * Supports labels, error states, icons, and clear button
 */

import { BorderRadius, FontSize, Size, Spacing } from '@/constants/designTokens';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { ThemedText } from './themed-text';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  icon?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  onClear?: () => void;
  showClearButton?: boolean;
  required?: boolean;
}

export default function TextInput({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  icon,
  secureTextEntry = false,
  multiline = false,
  numberOfLines,
  keyboardType = 'default',
  editable = true,
  style,
  inputStyle,
  onClear,
  showClearButton = false,
  required = false,
}: TextInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  const borderColor = error
    ? colors.error
    : focused
    ? colors.primary
    : colors.border;

  const inputHeight = multiline ? undefined : Size.inputHeight;

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <View style={styles.labelRow}>
          <ThemedText style={styles.label}>
            {label}
            {required && <ThemedText style={{ color: colors.error }}>*</ThemedText>}
          </ThemedText>
        </View>
      )}

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor,
            height: inputHeight,
          },
        ]}
      >
        {/* Left Icon */}
        {icon && (
          <View style={styles.iconLeft}>
            <Ionicons name={icon} size={20} color={colors.textSecondary} />
          </View>
        )}

        {/* TextInput */}
        <RNTextInput
          style={[
            styles.input,
            {
              color: colors.text,
              flex: 1,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {/* Right Actions */}
        <View style={styles.rightActions}>
          {/* Clear Button */}
          {showClearButton && value && (
            <TouchableOpacity
              onPress={() => {
                onChangeText('');
                onClear?.();
              }}
              hitSlop={{ top: Spacing.md, bottom: Spacing.md, left: Spacing.md, right: Spacing.md }}
            >
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}

          {/* Password Toggle */}
          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: Spacing.md, bottom: Spacing.md, left: Spacing.md, right: Spacing.md }}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <ThemedText style={[styles.error, { color: colors.error }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  input: {
    fontSize: FontSize.base,
    paddingVertical: Spacing.md,
  },
  iconLeft: {
    marginRight: Spacing.md,
  },
  rightActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginLeft: Spacing.md,
  },
  error: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
});
