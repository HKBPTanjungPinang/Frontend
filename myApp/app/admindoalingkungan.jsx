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

export default function AdminDoaLingkunganScreen() {
  const router = useRouter();

  const pdfList = [
    "Partangiangan Wijk 2 (10-Mar-2026)",
    "Partangiangan Wijk 3 (17-Mar-2026)",
    "Partangiangan Wijk 4 (24-Mar-2026)",
    "Partangiangan Wijk 5 (31-Mar-2026)",
  ];

  const handlePress = (index) => {
    if (index === 0) {
      router.push("");
    }
  };

  return (
    <LinearGradient
      colors={["#0000A8", "#E6E6E6"]}
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

        <Text style={styles.headerTitle}>Doa Lingkungan</Text>
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
            onPress={() => handlePress(index)}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="picture-as-pdf" size={24} color="black" />
            </View>

            <Text style={styles.pdfText} numberOfLines={1}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Button Hapus dan Tambah */}
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
    paddingTop: 10,
    paddingHorizontal: 12,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  backButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  scrollContent: {
    paddingBottom: 24,
  },

  pdfCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 7,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 22,
  },

  iconContainer: {
    marginRight: 12,
  },

  pdfText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
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
