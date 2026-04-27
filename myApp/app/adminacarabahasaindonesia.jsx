import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminAcaraMingguBahasaIndonesiaScreen() {
  const router = useRouter();

  const pdfList = [
    "Minggu Okuli (08-Mar-2026) - INA",
    "Minggu Okuli (08-Mar-2026) - INA",
    "Minggu Okuli (08-Mar-2026) - INA",
    "Minggu Okuli (08-Mar-2026) - INA",
  ];

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Acara Minggu Bahasa Indonesia</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pdfList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.pdfCard}
            activeOpacity={0.8}
            onPress={() => router.push("")}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="picture-as-pdf" size={28} color="black" />
            </View>

            <Text style={styles.pdfText} numberOfLines={1}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {}
      <View style={styles.bottomButtonRow}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>Hapus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  pdfCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 22,
  },

  iconContainer: {
    marginRight: 12,
  },

  pdfText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  bottomButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 6,
  },

  actionButton: {
    backgroundColor: "#0000A8",
    width: 95,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
