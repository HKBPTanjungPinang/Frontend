import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AcaraMingguBahasaBatakScreen() {
  const router = useRouter();

  const pdfList = [
    "Minggu Okuli (08-Mar-2026) - BTK",
    "Minggu Okuli (08-Mar-2026) - BTK",
    "Minggu Okuli (08-Mar-2026) - BTK",
    "Minggu Okuli (08-Mar-2026) - BTK",
  ];

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Acara Minggu Bahasa Batak</Text>
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
            onPress={() => router.push("../teksacaraminggubahasabatak")}
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
});