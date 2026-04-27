import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OptionalLoginScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logohkbp.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/dashboardjemaat")}
          >
            <Text style={styles.buttonText}>Jemaat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/loginadmin")}
          >
            <Text style={styles.buttonText}>Admin</Text>
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

  header: {
    alignItems: "center",
    marginTop: 80,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  logo: {
    width: 60,
    height: 60,
  },

  content: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
  },

  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 35,
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 10,
  },

  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
});
