import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { clearAllAdminData, logoutAdmin } from "../constants/adminApi";

export default function DashboardAdminScreen() {
  const router = useRouter();
  const [clearing, setClearing] = useState(false);

  const handleClearAll = () => {
    Alert.alert(
      "Bersihkan semua data",
      "Semua data publik di Cloudflare akan dihapus.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: async () => {
            try {
              setClearing(true);
              const deleted = await clearAllAdminData();
              Alert.alert(
                "Data dibersihkan",
                `${deleted.length} data berhasil dihapus.`,
              );
            } catch (err) {
              Alert.alert(
                "Gagal membersihkan",
                err.message || "Data belum berhasil dihapus.",
              );
            } finally {
              setClearing(false);
            }
          },
        },
      ],
    );
  };

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Header Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logohkbp.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={require("../assets/images/gereja.jpeg")}
          style={styles.banner}
          resizeMode="cover"
        />
        <Text style={styles.bannerText}>
          Selamat Datang di Aplikasi HKBP Tanjung Pinang
        </Text>
      </View>

      {/* Menu Wrapper */}
      <View style={styles.menuWrapper}>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/adminsejarah")}
          >
            <Ionicons name="hourglass-outline" size={55} color="black" />
            <Text style={styles.cardText}>Sejarah</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/adminacaraminggu")}
          >
            <Ionicons name="book-outline" size={55} color="black" />
            <Text style={styles.cardText}>Acara Minggu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/admindoalingkungan")}
          >
            <FontAwesome5 name="cross" size={55} color="black" />
            <Text style={styles.cardText}>Partangiangan Wijk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/adminpartangiangankeluarga")}
          >
            <Ionicons name="add" size={55} color="black" />
            <Text style={styles.cardText}>Partangiangan Keluarga</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <Ionicons name="person-circle-outline" size={55} color="#CCCCCC" />
            <Text style={[styles.cardText, { color: "#CCCCCC" }]}>
              Warta Jemaat
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            logoutAdmin();
            router.replace("/optionallogin");
          }}
        >
          <Ionicons name="log-out-outline" size={32} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleClearAll}
          disabled={clearing}
        >
          {clearing ? (
            <ActivityIndicator color="black" />
          ) : (
            <Ionicons name="trash-outline" size={32} color="black" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/settings")}
        >
          <Ionicons name="settings" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },

  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  logo: {
    width: 42,
    height: 42,
  },

  bannerContainer: {
    marginTop: 25,
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 6,
    backgroundColor: "#fff",
    position: "relative",
  },

  banner: {
    width: "100%",
    height: 105,
  },

  bannerText: {
    position: "absolute",
    top: "38%",
    alignSelf: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
  },

  menuWrapper: {
    flex: 1,
    justifyContent: "center",
  },

  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
  },

  card: {
    width: 145,
    height: 115,
    backgroundColor: "#E5E5E5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    marginBottom: 25,
    paddingHorizontal: 10,
  },

  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },

  bottomNav: {
    height: 70,
    backgroundColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 55,
  },

  navButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
});
