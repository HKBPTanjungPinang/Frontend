import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

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
            onPress={() => router.push("/sejarah")}
          >
            <Ionicons name="hourglass-outline" size={55} color="black" />
            <Text style={styles.cardText}>Sejarah</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/acaraminggu")}
          >
            <Ionicons name="book-outline" size={55} color="black" />
            <Text style={styles.cardText}>Acara Minggu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("../acaradoalingkungan")}
          >
            <FontAwesome5 name="cross" size={55} color="black" />
            <Text style={styles.cardText}>Doa Lingkungan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={32} color="black" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialIcons name="featured-play-list" size={32} color="black" />
        </TouchableOpacity>

        <TouchableOpacity>
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
    borderRadius: 14,
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
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    marginBottom: 25,
  },

  cardText: {
    marginTop: 10,
    fontSize: 16,
    color: "#222",
  },

  bottomNav: {
    height: 70,
    backgroundColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
