import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getFileViewUrl,
  getItemTitle,
  getPublicDetail,
  openFileDownload,
  openFileView,
} from "../constants/publicApi";

export default function PdfViewerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = String(params.category || "");
  const id = String(params.id || "");
  const fallbackTitle = String(params.title || "Dokumen");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const title = detail ? getItemTitle(detail, fallbackTitle) : fallbackTitle;

  useEffect(() => {
    let mounted = true;

    const loadDetail = async () => {
      try {
        setError("");
        const data = await getPublicDetail(category, id);
        if (mounted) setDetail(data);
      } catch (err) {
        if (mounted) setError(err.message || "Detail dokumen belum bisa dimuat");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (category && id) {
      loadDetail();
    } else {
      setLoading(false);
      setError("Parameter dokumen tidak lengkap");
    }

    return () => {
      mounted = false;
    };
  }, [category, id]);

  const handleRefresh = () => {
    setLoading(true);
    setDetail(null);
    setError("");
    getPublicDetail(category, id)
      .then(setDetail)
      .catch((err) =>
        setError(err.message || "Detail dokumen belum bisa dimuat")
      )
      .finally(() => setLoading(false));
  };

  const viewUrl = category && id ? getFileViewUrl(category, id) : "";

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>

          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={22} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => openFileDownload(category, id)}
          >
            <MaterialIcons name="file-download" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color="#000080" />
            <Text style={styles.stateText}>Memuat detail...</Text>
          </View>
        ) : error ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{error}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRefresh}>
              <Text style={styles.primaryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : Platform.OS === "web" ? (
          <View style={styles.webFrame}>
            {viewUrl
              ? React.createElement("iframe", {
                  src: viewUrl,
                  style: styles.iframe,
                  title,
                })
              : null}
          </View>
        ) : (
          <View style={styles.messageBox}>
            <MaterialIcons name="picture-as-pdf" size={46} color="#000080" />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => openFileView(category, id)}
            >
              <Text style={styles.primaryButtonText}>Lihat PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBar: {
    marginTop: 18,
    width: "100%",
    backgroundColor: "#F2F2F2",
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    padding: 16,
  },

  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  stateText: {
    color: "#000080",
    fontSize: 14,
    fontWeight: "700",
  },

  messageBox: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },

  messageText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  primaryButton: {
    marginTop: 18,
    backgroundColor: "#000080",
    borderRadius: 6,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  webFrame: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
  },

  iframe: {
    width: "100%",
    height: "100%",
    borderWidth: 0,
  },
});
