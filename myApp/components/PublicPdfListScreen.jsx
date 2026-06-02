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
import DateSearchBar from "./DateSearchBar";

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
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = useCallback(async () => {
    try {
      setError("");
      const data = await getPublicList(category);
      setItems(data);
      setCurrentPage(1);
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

  const handleDateChange = (date) => {
    setSearchDate(date);
    setCurrentPage(1);
  };

  const filteredItems = searchDate
    ? items.filter((item) => {
        const itemDate = getItemDate(item) || "";
        return itemDate.includes(searchDate);
      })
    : items;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const showFullMeta = category === "partangiangan-wijk";

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

      {!loading && !error ? (
        <DateSearchBar
          value={searchDate}
          onChange={handleDateChange}
          placeholder="Cari tanggal (YYYY-MM-DD)"
        />
      ) : null}

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
                <Ionicons name="refresh" size={17} color="#FFFFFF" />
                <Text style={styles.retryText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!error && filteredItems.length === 0 ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                {searchDate ? "Tidak ada data yang cocok." : "Belum ada data."}
              </Text>
            </View>
          ) : null}

          {paginatedItems.map((item, index) => {
            const id = getItemId(item) || index;
            const titleIndex = (currentPage - 1) * itemsPerPage + index + 1;
            const metaParts = showFullMeta
              ? [getItemDate(item), item.waktu, item.lokasi]
              : [getItemDate(item)];
            const meta = metaParts.filter(Boolean).join(" - ");

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
                    {getItemTitle(item, `${title} ${titleIndex}`)}
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

          {totalPages > 1 ? (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.pageButtonDisabled,
                ]}
                onPress={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
              >
                <Ionicons name="chevron-back" size={17} color="#FFFFFF" />
                <Text style={styles.pageButtonText}>Sebelumnya</Text>
              </TouchableOpacity>

              <View style={styles.pageIndicator}>
                <Text style={styles.pageInfo}>
                  {currentPage} / {totalPages}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.pageButtonDisabled,
                ]}
                onPress={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.pageButtonText}>Berikutnya</Text>
                <Ionicons name="chevron-forward" size={17} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : null}
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
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 34,
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
    padding: 20,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  iconContainer: {
    marginRight: 12,
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
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

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    marginBottom: 20,
  },

  pageButton: {
    backgroundColor: "#000080",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  pageButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },

  pageButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  pageIndicator: {
    backgroundColor: "#D9D9D9",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  pageInfo: {
    color: "#000080",
    fontSize: 13,
    fontWeight: "700",
    minWidth: 48,
    textAlign: "center",
  },
});
