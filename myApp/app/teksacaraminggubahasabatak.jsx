import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TeksAcaraMingguBahasaBatakScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>

          <Text style={styles.title} numberOfLines={1}>
            Minggu Okuli ...
          </Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="refresh" size={22} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="file-download" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT AREA */}
      <View style={styles.content} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBar: {
    marginTop: 18,
    marginHorizontal: 0,
    width: "100%",
    backgroundColor: "#F2F2F2",
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  backButton: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    flexShrink: 1,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    marginLeft: 14,
  },

  content: {
    flex: 1,
  },
});