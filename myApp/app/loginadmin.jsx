import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { loginAdmin } from "../constants/adminApi";

export default function LoginAdminScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Login belum lengkap", "Isi email dan password admin.");
      return;
    }

    try {
      setLoading(true);
      await loginAdmin({ email, password });
      router.replace("/dashboardadmin");
    } catch (err) {
      Alert.alert("Login gagal", err.message || "Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logohkbp.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {}
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Lupa Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 28,
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

  cardWrapper: {
    flex: 1,
    justifyContent: "center",
    marginTop: -50,
  },

  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 2,
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 34,
    marginHorizontal: 4,
  },

  inputGroup: {
    marginBottom: 28,
  },

  label: {
    fontSize: 24,
    color: "#1E1E1E",
    marginBottom: 6,
  },

  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#1E1E1E",
    fontSize: 18,
    paddingVertical: 4,
    color: "#000",
  },

  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: -12,
    marginBottom: 24,
  },

  forgotText: {
    fontSize: 14,
    color: "#1E1E1E",
  },

  loginButton: {
    alignSelf: "center",
    backgroundColor: "#000080",
    paddingVertical: 10,
    paddingHorizontal: 34,
    minWidth: 110,
    alignItems: "center",
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "500",
  },
});
