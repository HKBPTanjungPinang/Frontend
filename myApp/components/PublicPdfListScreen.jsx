import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getItemDate,
  getItemId,
  getItemTitle,
  getPublicList,
} from "../constants/publicApi";

export default function PublicPdfListScreen({
  category,
  title,
  gradient = ["#000080", "#FFFFFF"],
}) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const data = await getPublicList(category);
      setItems(data);
    } catch (err) {
      setError(err.message || "Data belum bisa dimuat");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleOpen = (item) => {
    const id = getItemId(item);

    if (!id) {
      setError("Data ini belum memiliki ID dari server");
      return;
    }

    router.push({
      pathname: "/pdfviewer",
      params: {
        category,
        id: String(id),
        title: getItemTitle(item),
      },
    });
  };

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color="#FFFFFF" />
          <Text style={styles.stateText}>Memuat data...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                <Text style={styles.retryText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!error && items.length === 0 ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>Belum ada data.</Text>
            </View>
          ) : null}

          {items.map((item, index) => {
            const id = getItemId(item) || index;
            const meta = [getItemDate(item), item.lokasi, item.waktu]
              .filter(Boolean)
              .join(" - ");

            return (
              <TouchableOpacity
                key={String(id)}
                style={styles.pdfCard}
                activeOpacity={0.8}
                onPress={() => handleOpen(item)}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="picture-as-pdf" size={28} color="black" />
                </View>

                <View style={styles.cardTextGroup}>
                  <Text style={styles.pdfText} numberOfLines={1}>
                    {getItemTitle(item, `${title} ${index + 1}`)}
                  </Text>
                  {meta ? (
                    <Text style={styles.dateText} numberOfLines={1}>
                      {meta}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  stateText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  messageBox: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    padding: 18,
    marginBottom: 18,
  },

  messageText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  retryButton: {
    alignSelf: "center",
    marginTop: 12,
    backgroundColor: "#000080",
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
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

  cardTextGroup: {
    flex: 1,
  },

  pdfText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: "#333333",
  },
});
