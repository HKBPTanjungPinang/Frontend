/**
 * Component Showcase Page - Menampilkan semua components dengan contoh
 * 
 * Import dan gunakan halaman ini untuk testing dan development
 * Route: /components-showcase
 */

import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import GradientContainer from '@/components/GradientContainer';
import Header from '@/components/Header';
import MenuCard from '@/components/MenuCard';
import TextInput from '@/components/TextInput';
import { ThemedText } from '@/components/themed-text';
import { Error, Primary, Secondary, Success } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/designTokens';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function ComponentShowcase() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  return (
    <GradientContainer preset="background">
      <SafeAreaView style={styles.container}>
        <Header showLogo={true} useGradient={true} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* BUTTONS SECTION */}
          <Section title="🔘 BUTTONS">
            <View style={styles.itemRow}>
              <Button label="Primary" variant="primary" onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Secondary" variant="secondary" onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Success" variant="success" onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Error" variant="error" onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Warning" variant="warning" onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Info" variant="info" onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Ghost" variant="ghost" onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Outline" variant="outline" onPress={() => {}} fullWidth />
            </View>

            {/* Button Sizes */}
            <ThemedText style={styles.subtitle}>Sizes</ThemedText>
            <View style={styles.itemRow}>
              <Button label="Small" size="small" onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Medium (Default)" size="medium" onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Large" size="large" onPress={() => {}} fullWidth />
            </View>

            {/* Button States */}
            <ThemedText style={styles.subtitle}>States</ThemedText>
            <View style={styles.itemRow}>
              <Button label="Disabled" variant="primary" disabled onPress={() => {}} fullWidth />
            </View>
            <View style={styles.itemRow}>
              <Button label="Loading" variant="primary" loading onPress={() => {}} fullWidth />
            </View>

            {/* Button with Icon */}
            <View style={styles.itemRow}>
              <Button 
                label="With Icon" 
                variant="primary" 
                icon={<Ionicons name="star" size={20} color="#fff" />}
                onPress={() => {}} 
                fullWidth 
              />
            </View>
          </Section>

          {/* CARDS SECTION */}
          <Section title="🎴 CARDS">
            <Card variant="elevated">
              <ThemedText style={styles.cardText}>Elevated Card (Default)</ThemedText>
            </Card>
            <Card variant="filled">
              <ThemedText style={styles.cardText}>Filled Card</ThemedText>
            </Card>
            <Card variant="outlined">
              <ThemedText style={styles.cardText}>Outlined Card</ThemedText>
            </Card>
            <Card
              variant="elevated"
              onPress={() => {}}
              style={styles.pressableCard}
            >
              <ThemedText style={styles.cardText}>Pressable Card</ThemedText>
            </Card>
          </Section>

          {/* MENU CARDS SECTION */}
          <Section title="📋 MENU CARDS">
            <MenuCard
              icon={<Ionicons name="home" size={32} color={Primary[600]} />}
              label="Home"
              subtitle="Go to home page"
              onPress={() => {}}
              gradient={{
                colors: [Primary[50], Primary[100]],
                start: { x: 0, y: 0 },
                end: { x: 1, y: 1 },
              }}
            />
            <MenuCard
              icon={<Ionicons name="settings" size={32} color={Secondary[600]} />}
              label="Settings"
              subtitle="Manage preferences"
              onPress={() => {}}
              gradient={{
                colors: [Secondary[50], Secondary[100]],
                start: { x: 0, y: 0 },
                end: { x: 1, y: 1 },
              }}
            />
            <MenuCard
              icon={<Ionicons name="checkmark-circle" size={32} color={Success[600]} />}
              label="Success"
              subtitle="Operasi berhasil"
              onPress={() => {}}
              gradient={{
                colors: [Success[50], Success[100]],
                start: { x: 0, y: 0 },
                end: { x: 1, y: 1 },
              }}
            />
          </Section>

          {/* TEXT INPUT SECTION */}
          <Section title="📝 TEXT INPUTS">
            <TextInput
              label="Regular Input"
              placeholder="Masukkan teks..."
              value={inputValue}
              onChangeText={setInputValue}
              showClearButton
              required
            />
            <TextInput
              label="Input with Icon"
              placeholder="Email address..."
              value=""
              onChangeText={() => {}}
              icon="mail"
              keyboardType="email-address"
            />
            <TextInput
              label="Password"
              placeholder="Enter password..."
              value={passwordValue}
              onChangeText={setPasswordValue}
              secureTextEntry
            />
            <TextInput
              label="With Error"
              placeholder="Invalid input..."
              value=""
              onChangeText={() => {}}
              error="This field is required"
            />
            <TextInput
              label="Multiline"
              placeholder="Enter message..."
              value=""
              onChangeText={() => {}}
              multiline
              numberOfLines={4}
            />
            <TextInput
              label="Disabled"
              placeholder="Disabled input..."
              value="Cannot edit this"
              onChangeText={() => {}}
              editable={false}
            />
          </Section>

          {/* CONTAINERS SECTION */}
          <Section title="📦 CONTAINERS">
            <GradientContainer preset="primary" padding={Spacing.lg}>
              <ThemedText style={{ color: '#fff', fontWeight: '600' }}>
                Primary Gradient Container
              </ThemedText>
            </GradientContainer>

            <GradientContainer preset="secondary" padding={Spacing.lg}>
              <ThemedText style={{ color: '#fff', fontWeight: '600' }}>
                Secondary Gradient Container
              </ThemedText>
            </GradientContainer>

            <Container backgroundColor={colors.surface}>
              <ThemedText style={{ fontWeight: '600' }}>
                Regular Container
              </ThemedText>
            </Container>
          </Section>

          {/* COLOR PALETTE SECTION */}
          <Section title="🎨 COLOR PALETTE">
            <View style={styles.colorGrid}>
              <ColorSwatch label="Primary" color={Primary[500]} />
              <ColorSwatch label="Secondary" color={Secondary[500]} />
              <ColorSwatch label="Success" color={Success[500]} />
              <ColorSwatch label="Error" color={Error[500]} />
            </View>
          </Section>

          {/* SPACING SHOWCASE */}
          <Section title="📏 SPACING SCALE">
            <View>
              <SpacingItem label="xs (4px)" size={4} />
              <SpacingItem label="sm (8px)" size={8} />
              <SpacingItem label="md (12px)" size={12} />
              <SpacingItem label="lg (16px)" size={16} />
              <SpacingItem label="xl (20px)" size={20} />
              <SpacingItem label="xxl (24px)" size={24} />
            </View>
          </Section>

          {/* INFO */}
          <Section title="ℹ️ INFO">
            <Container>
              <ThemedText style={{ fontSize: FontSize.sm, marginBottom: Spacing.md }}>
                Halaman ini menampilkan semua components dan design tokens yang tersedia dalam design system.
              </ThemedText>
              <ThemedText style={{ fontSize: FontSize.xs, color: colors.textTertiary }}>
                Untuk dokumentasi lengkap, lihat constants/DESIGN_SYSTEM.md
              </ThemedText>
            </Container>
          </Section>
        </ScrollView>
      </SafeAreaView>
    </GradientContainer>
  );
}

// Helper Components
function Section({ title, children }: any) {
  const colors = Colors[useColorScheme() ?? 'light'];
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

function ColorSwatch({ label, color }: any) {
  return (
    <View style={styles.colorSwatchContainer}>
      <View style={[styles.colorSwatch, { backgroundColor: color }]} />
      <ThemedText style={styles.colorLabel}>{label}</ThemedText>
      <ThemedText style={styles.colorValue}>{color}</ThemedText>
    </View>
  );
}

function SpacingItem({ label, size }: any) {
  return (
    <View style={styles.spacingItem}>
      <ThemedText style={styles.spacingLabel}>{label}</ThemedText>
      <View style={[styles.spacingBox, { height: size, width: size * 10 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  itemRow: {
    marginBottom: Spacing.md,
  },
  cardText: {
    fontWeight: '600',
  },
  pressableCard: {
    opacity: 0.8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorSwatchContainer: {
    width: '48%',
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  colorSwatch: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  colorLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  colorValue: {
    fontSize: FontSize.xs,
  },
  spacingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  spacingLabel: {
    width: 80,
    fontSize: FontSize.sm,
  },
  spacingBox: {
    backgroundColor: Primary[300],
    borderRadius: 4,
  },
});
