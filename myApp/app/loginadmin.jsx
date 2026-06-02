import { Ionicons } from "@expo/vector-icons";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Login belum lengkap", "Isi username dan password admin.");
      return;
    }

    try {
      setLoading(true);
      await loginAdmin({ username, password });
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
            <Text style={styles.label}>Username:</Text>
            <View style={styles.inputShell}>
              <Ionicons name="person-outline" size={20} color="#1E1E1E" />
              <TextInput
                style={styles.input}
                placeholder=""
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password:</Text>
            <View style={styles.inputShell}>
              <Ionicons name="lock-closed-outline" size={20} color="#1E1E1E" />
              <TextInput
                style={styles.input}
                placeholder=""
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.forgotContainer}>
            <Ionicons name="help-circle-outline" size={16} color="#1E1E1E" />
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
              <>
                <Ionicons name="log-in-outline" size={22} color="#FFFFFF" />
                <Text style={styles.loginButtonText}>Login</Text>
              </>
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

  inputShell: {
    borderBottomWidth: 2,
    borderBottomColor: "#1E1E1E",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 4,
    color: "#000",
  },

  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: -12,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderRadius: 6,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "500",
  },
});
