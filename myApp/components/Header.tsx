/**
 * Header Component - Reusable header with logo and optional navigation
 * Supports custom actions and consistent styling
 */

import { Gradients } from '@/constants/colors';
import { BorderRadius, Shadows, Size, Spacing } from '@/constants/designTokens';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  showBackButton?: boolean;
  showLogo?: boolean;
  title?: string;
  rightAction?: () => void;
  rightActionIcon?: string;
  customStyles?: any;
  useGradient?: boolean;
}

export default function Header({
  showBackButton = false,
  showLogo = true,
  rightAction,
  rightActionIcon = 'ellipsis-vertical',
  useGradient = true,
}: HeaderProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const headerContent = (
    <View style={[styles.container, { paddingVertical: Spacing.lg }]}>
      {/* Left Action */}
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.actionButton}
            hitSlop={{ top: Spacing.md, bottom: Spacing.md, left: Spacing.md, right: Spacing.md }}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={colorScheme === 'dark' ? colors.text : '#ffffff'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Logo */}
      {showLogo && (
        <View style={styles.centerSection}>
          <Image
            source={require('@/assets/images/logohkbp.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Right Action */}
      <View style={styles.rightSection}>
        {rightAction && (
          <TouchableOpacity
            onPress={rightAction}
            style={styles.actionButton}
            hitSlop={{ top: Spacing.md, bottom: Spacing.md, left: Spacing.md, right: Spacing.md }}
          >
            <Ionicons
              name={rightActionIcon}
              size={24}
              color={colorScheme === 'dark' ? colors.text : '#ffffff'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (useGradient) {
    return (
      <LinearGradient
        colors={Gradients.headerGradient.colors}
        start={Gradients.headerGradient.start}
        end={Gradients.headerGradient.end}
        style={styles.gradient}
      >
        {headerContent}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, ...Shadows.md }]}>
      {headerContent}
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: Spacing.lg,
    ...Shadows.md,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  logo: {
    width: Size.avatarLg,
    height: Size.avatarLg,
  },
  actionButton: {
    width: Size.touchMinHeight,
    height: Size.touchMinHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
});
