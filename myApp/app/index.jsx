import { useRouter } from "expo-router";
import { useEffect } from "react";3
import { Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/splashscreen");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logohkbp.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.footer}>
        <Text style={styles.madeText}>Made with</Text>

        <View style={styles.nameContainer}>
          <Image
            source={require("../assets/images/foto.jpeg")}
            style={styles.profile}
          />
          <Text style={styles.name}>Edgar Simatupang</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  madeText: {
    color: "#ccc",
    fontSize: 12,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  profile: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
