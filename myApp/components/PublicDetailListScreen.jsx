import { Ionicons } from "@expo/vector-icons";
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

export default function PublicDetailListScreen({
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
            const tanggal = getItemDate(item) || "-";
            const lokasi = item.lokasi || "-";
            const waktu = item.waktu || "-";

            return (
              <TouchableOpacity
                key={String(id)}
                style={styles.detailCard}
                activeOpacity={0.8}
                onPress={() => handleOpen(item)}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {getItemTitle(item, `${title} ${index + 1}`)}
                  </Text>

                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#000080" />
                    <Text style={styles.detailText}>{tanggal}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#000080" />
                    <Text style={styles.detailText}>{waktu}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color="#000080" />
                    <Text style={styles.detailText}>{lokasi}</Text>
                  </View>
                </View>

                <View style={styles.actionIcon}>
                  <Ionicons name="chevron-forward" size={24} color="#000080" />
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
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },

  messageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 12,
    backgroundColor: "#000080",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardContent: {
    flex: 1,
    marginRight: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000080",
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },

  detailText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },

  actionIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
});
