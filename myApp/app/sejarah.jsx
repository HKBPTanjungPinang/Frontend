import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  buildApiUrl,
  getItemDescription,
  getItemTitle,
  getPublicList,
} from "../constants/publicApi";

const fallbackParagraphs = [
  "Awal mula jemaat HKBP di Tanjung Pinang tidak dapat dipastikan secara tepat, tetapi diketahui bahwa orang-orang Batak Kristen pada masa itu beribadah bersama umat Kristen dari berbagai suku lain seperti Ambon, Manado, Jawa, dan suku lainnya di gereja yang dikenal sebagai Vierde Kerk di Jalan Gereja No. 1 Tanjung Pinang.",
  "Pada akhir tahun 1950, Pdt. M. Pakpahan dari HKBP Distrik Jawa-Kalimantan datang ke Tanjung Pinang dan disambut baik oleh jemaat asal HKBP. Dari proses inilah HKBP Tanjung Pinang resmi berdiri pada 7 Oktober 1951 dengan sekitar 20 kepala keluarga.",
];

const getImageUrl = (item) => {
  const value = item?.gambar_url || item?.image_url || item?.gambar || "";

  if (!value || typeof item === "string") return "";
  if (String(value).startsWith("http")) return value;
  if (String(value).startsWith("uploads/")) return buildApiUrl(value);

  return buildApiUrl(`/uploads/sejarah/${value}`);
};

export default function SejarahScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      const data = await getPublicList("sejarah");
      setItems(data);
    } catch (err) {
      setError(err.message || "Data sejarah belum bisa dimuat");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const contentItems = items.length > 0 ? items : fallbackParagraphs;

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sejarah HKBP Tanjung Pinang</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.imageContainer}>
            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color="#000080" />
                <Text style={styles.loadingText}>Memuat sejarah...</Text>
              </View>
            ) : null}

            {!loading && error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                  <Text style={styles.retryText}>Coba Lagi</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {!loading &&
              !error &&
              contentItems.map((item, index) => {
                const imageUrl = getImageUrl(item);
                const title =
                  typeof item === "string" ? "" : getItemTitle(item, "");
                const paragraph =
                  typeof item === "string" ? item : getItemDescription(item);

                return (
                  <View
                    key={String(item?.id || item?._id || index)}
                    style={styles.historyBlock}
                  >
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={index === 0 ? styles.churchImage : styles.historyImage}
                        resizeMode="cover"
                      />
                    ) : null}
                    {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
                    {paragraph ? (
                      <Text style={styles.paragraph}>{paragraph}</Text>
                    ) : null}
                  </View>
                );
              })}
          </View>

          <TouchableOpacity
            style={styles.kembaliButton}
            onPress={() => router.back()}
          >
            <Text style={styles.kembaliText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    alignItems: "center",
    marginTop: 35,
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 10,
  },

  imageContainer: {
    width: "95%",
    backgroundColor: "#D9D9D9",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 25,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderRadius: 8,
  },

  churchImage: {
    width: "92%",
    height: 420,
    borderRadius: 6,
    marginBottom: 18,
  },

  loadingBox: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 24,
  },

  loadingText: {
    color: "#000080",
    fontSize: 14,
    fontWeight: "700",
  },

  errorBox: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
  },

  errorText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  retryButton: {
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

  sectionTitle: {
    width: "100%",
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  historyImage: {
    width: "100%",
    height: 220,
    borderRadius: 6,
    marginBottom: 8,
  },

  historyBlock: {
    width: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },

  paragraph: {
    width: "100%",
    maxWidth: "100%",
    flexShrink: 1,
    flexWrap: "wrap",
    fontSize: 14,
    lineHeight: 24,
    color: "#222",
    textAlign: "justify",
    marginBottom: 16,
  },

  kembaliButton: {
    backgroundColor: "#000080",
    width: 145,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  kembaliText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
