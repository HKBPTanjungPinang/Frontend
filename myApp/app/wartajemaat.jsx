import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WartaJemaatScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logohkbp.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/kontemporer")}
          >
            <Text style={styles.buttonText}>Kontemporer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/tingting")}
          >
            <Text style={styles.buttonText}>Tingting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 52,
    left: 20,
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  header: {
    alignItems: "center",
    marginTop: 40,
  },

  logoContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 40,
    height: 40,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  button: {
    width: 150,
    height: 75,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  buttonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
});
