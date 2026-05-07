/**
 * Design System Documentation
 * 
 * Panduan lengkap untuk menggunakan design system yang baru di aplikasi HKBP Tanjung Pinang
 * 
 * ============================================================================
 * 1. COLOR SYSTEM
 * ============================================================================
 * 
 * Aplikasi menggunakan design token colors yang modern dan accessible.
 * Lihat: constants/colors.ts
 * 
 * Usage:
 * ```tsx
 * import { Colors } from '@/constants/theme';
 * import { useColorScheme } from '@/hooks/use-color-scheme';
 * 
 * const MyComponent = () => {
 *   const colorScheme = useColorScheme();
 *   const colors = Colors[colorScheme ?? 'light'];
 *   
 *   return <View style={{ backgroundColor: colors.background }} />;
 * };
 * ```
 * 
 * ============================================================================
 * 2. SPACING SYSTEM
 * ============================================================================
 * 
 * Gunakan Spacing constants untuk konsistensi padding dan margin.
 * Lihat: constants/designTokens.ts
 * 
 * Spacing scale (multiples of 4px):
 * - xs: 4px
 * - sm: 8px
 * - md: 12px
 * - lg: 16px
 * - xl: 20px
 * - xxl: 24px
 * - xxxl: 32px
 * - xxxxl: 40px
 * 
 * Usage:
 * ```tsx
 * import { Spacing } from '@/constants/designTokens';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     padding: Spacing.lg,
 *     marginBottom: Spacing.md,
 *   },
 * });
 * ```
 * 
 * ============================================================================
 * 3. TYPOGRAPHY
 * ============================================================================
 * 
 * Font sizes dan weights yang standar:
 * - xs: 12px (captions)
 * - sm: 14px (labels)
 * - base: 16px (body text)
 * - md: 18px (subheadings)
 * - lg: 20px (section titles)
 * - xl: 24px (headings)
 * - xxl: 28px (main headings)
 * - xxxl: 32px (hero titles)
 * 
 * Usage:
 * ```tsx
 * import { FontSize, FontWeight } from '@/constants/designTokens';
 * 
 * const styles = StyleSheet.create({
 *   title: {
 *     fontSize: FontSize.lg,
 *     fontWeight: FontWeight.bold,
 *   },
 * });
 * ```
 * 
 * ============================================================================
 * 4. SHADOW SYSTEM
 * ============================================================================
 * 
 * Shadows dengan elevation levels:
 * - none: No shadow
 * - xs: Subtle shadow (1pt elevation)
 * - sm: Small shadow (2pt elevation)
 * - md: Medium shadow (4pt elevation) - Default
 * - lg: Large shadow (8pt elevation)
 * - xl: Extra large shadow (12pt elevation)
 * 
 * Usage:
 * ```tsx
 * import { Shadows } from '@/constants/designTokens';
 * 
 * const styles = StyleSheet.create({
 *   card: {
 *     ...Shadows.md,
 *     borderRadius: 12,
 *   },
 * });
 * ```
 * 
 * ============================================================================
 * 5. COMPONENTS
 * ============================================================================
 * 
 * === Header Component ===
 * Untuk menampilkan header dengan logo dan navigasi
 * 
 * Usage:
 * ```tsx
 * import Header from '@/components/Header';
 * 
 * <Header 
 *   showBackButton={true}
 *   showLogo={true}
 *   useGradient={true}
 * />
 * ```
 * 
 * Props:
 * - showBackButton?: boolean - Tampilkan tombol kembali
 * - showLogo?: boolean - Tampilkan logo (default: true)
 * - rightAction?: () => void - Callback untuk tombol aksi kanan
 * - rightActionIcon?: string - Icon untuk tombol aksi kanan (default: 'ellipsis-vertical')
 * - useGradient?: boolean - Gunakan gradient background (default: true)
 * 
 * 
 * === Button Component ===
 * Tombol yang konsisten dengan berbagai varian
 * 
 * Usage:
 * ```tsx
 * import Button from '@/components/Button';
 * 
 * <Button
 *   label="Kirim"
 *   variant="primary"
 *   size="medium"
 *   onPress={() => handleSubmit()}
 *   fullWidth
 * />
 * ```
 * 
 * Props:
 * - label: string - Teks tombol
 * - variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'ghost' | 'outline'
 * - size?: 'small' | 'medium' | 'large' (default: 'medium')
 * - loading?: boolean - Tampilkan loading indicator
 * - disabled?: boolean - Disable tombol
 * - icon?: React.ReactNode - Icon di sebelah teks
 * - fullWidth?: boolean - Penuhi lebar container
 * - useGradient?: boolean - Gunakan gradient untuk primary button
 * 
 * 
 * === Card Component ===
 * Kartu dengan berbagai varian styling
 * 
 * Usage:
 * ```tsx
 * import Card from '@/components/Card';
 * 
 * <Card
 *   variant="elevated"
 *   onPress={() => navigate()}
 *   padding={Spacing.lg}
 * >
 *   <Text>Konten Card</Text>
 * </Card>
 * ```
 * 
 * Props:
 * - variant?: 'elevated' | 'filled' | 'outlined' (default: 'elevated')
 * - onPress?: () => void - Callback ketika ditekan
 * - padding?: number - Padding dalam card
 * - margin?: number - Margin di sekitar card
 * - disabled?: boolean - Disable interaksi
 * 
 * 
 * === MenuCard Component ===
 * Card khusus untuk menu items dengan icon dan label
 * 
 * Usage:
 * ```tsx
 * import MenuCard from '@/components/MenuCard';
 * 
 * <MenuCard
 *   icon={<Ionicons name="home" size={32} />}
 *   label="Home"
 *   subtitle="Go to home page"
 *   onPress={() => navigate()}
 *   gradient={{
 *     colors: [Primary[50], Primary[100]],
 *     start: { x: 0, y: 0 },
 *     end: { x: 1, y: 1 },
 *   }}
 * />
 * ```
 * 
 * Props:
 * - icon: React.ReactNode - Icon untuk ditampilkan
 * - label: string - Label utama
 * - onPress: () => void - Callback ketika ditekan
 * - subtitle?: string - Subtitle atau deskripsi
 * - gradient?: - Gradient configuration
 * - disabled?: boolean - Disable card
 * 
 * 
 * === TextInput Component ===
 * Input field yang konsisten dengan styling modern
 * 
 * Usage:
 * ```tsx
 * import TextInput from '@/components/TextInput';
 * 
 * <TextInput
 *   label="Nama Lengkap"
 *   placeholder="Masukkan nama..."
 *   value={name}
 *   onChangeText={setName}
 *   icon="person"
 *   error={nameError}
 *   required
 * />
 * ```
 * 
 * Props:
 * - value: string - Nilai input
 * - onChangeText: (text: string) => void - Callback saat text berubah
 * - label?: string - Label untuk input
 * - placeholder?: string - Placeholder text
 * - error?: string - Pesan error
 * - icon?: string - Icon name dari Ionicons
 * - secureTextEntry?: boolean - Sembunyikan karakter (password)
 * - multiline?: boolean - Input multi-line
 * - required?: boolean - Tandai sebagai required
 * - showClearButton?: boolean - Tampilkan tombol clear
 * 
 * 
 * === GradientContainer Component ===
 * Container dengan gradient background
 * 
 * Usage:
 * ```tsx
 * import GradientContainer from '@/components/GradientContainer';
 * 
 * <GradientContainer preset="primary" padding={Spacing.lg}>
 *   <Text>Konten dengan gradient background</Text>
 * </GradientContainer>
 * ```
 * 
 * Props:
 * - preset?: 'primary' | 'secondary' | 'success' | 'header' | 'background' | 'custom'
 * - customColors?: string[] - Custom gradient colors
 * - padding?: number - Padding di dalam container
 * 
 * 
 * === Container Component ===
 * Simple container dengan consistent padding
 * 
 * Usage:
 * ```tsx
 * import Container from '@/components/Container';
 * 
 * <Container padded backgroundColor={colors.surface}>
 *   <Text>Content</Text>
 * </Container>
 * ```
 * 
 * ============================================================================
 * 6. BEST PRACTICES
 * ============================================================================
 * 
 * ✅ DO:
 * - Gunakan design tokens untuk semua styling
 * - Gunakan reusable components
 * - Pertahankan konsistensi spacing dan typography
 * - Gunakan semantic colors (success, error, warning, info)
 * - Support dark mode dengan menggunakan useColorScheme hook
 * - Gunakan Shadows untuk elevation yang konsisten
 * - Buat components yang flexible dan reusable
 * 
 * ❌ DON'T:
 * - Jangan hardcode warna, gunakan color constants
 * - Jangan gunakan magic numbers untuk spacing, gunakan Spacing tokens
 * - Jangan buat component styles yang tidak reusable
 * - Jangan ignore dark mode support
 * - Jangan gunakan warna yang berbeda untuk tujuan yang sama
 * - Jangan buat inline styles yang kompleks
 * 
 * ============================================================================
 * 7. EXAMPLES
 * ============================================================================
 * 
 * Lihat halaman berikut untuk contoh penggunaan:
 * - app/dashboardjemaat.jsx - Dashboard dengan menu grid
 * - app/dashboardadmin.jsx - Dashboard admin dengan button actions
 * 
 * ============================================================================
 * 8. MAINTENANCE & UPDATES
 * ============================================================================
 * 
 * Jika perlu mengubah design system:
 * 1. Update design token di constants/designTokens.ts
 * 2. Update colors di constants/colors.ts
 * 3. Update theme di constants/theme.ts jika diperlukan
 * 4. Component akan otomatis menggunakan token baru
 * 5. Test di light dan dark mode
 * 
 * ============================================================================
 */

export const DESIGN_SYSTEM_DOCS = 'See comments in this file for comprehensive documentation';
