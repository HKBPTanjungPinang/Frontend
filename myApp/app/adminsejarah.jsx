import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    appendFileToFormData,
    createAdminItem,
    deleteAdminItem,
    getAdminList,
    toUploadFile,
    updateAdminItem,
} from "../constants/adminApi";
import {
    buildApiUrl,
    getItemDescription,
    getItemId,
} from "../constants/publicApi";
import FormPickerField from "../components/FormPickerField";

const emptyForm = {
  deskripsi: "",
  gambar: null,
};

const getImageUrl = (item) => {
  const value = item?.gambar_url || item?.image_url || item?.gambar || "";

  if (!value) return "";
  if (String(value).startsWith("http")) return value;
  if (String(value).startsWith("uploads/")) return buildApiUrl(value);

  return buildApiUrl(`/uploads/sejarah/${value}`);
};

export default function AdminSejarahScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    try {
      setError("");
      const data = await getAdminList("sejarah");
      setItems(data);
      setSelected((current) => {
        if (data.length === 0) return null;
        if (!current) return data[0];
        const currentId = getItemId(current);
        return data.find((item) => getItemId(item) === currentId) || data[0];
      });
    } catch (err) {
      setError(err.message || "Data sejarah belum bisa dimuat");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData])
  );

  const openCreate = () => {
    if (items.length > 0) {
      Alert.alert(
        "Sejarah sudah ada",
        "Data sejarah hanya boleh satu. Gunakan tombol Ubah untuk memperbarui data."
      );
      return;
    }

    setMode("create");
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEdit = () => {
    if (!selected) {
      Alert.alert("Pilih data", "Pilih satu data terlebih dahulu.");
      return;
    }

    setMode("edit");
    setForm({
      deskripsi: getItemDescription(selected),
      gambar: null,
    });
    setModalVisible(true);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Izin diperlukan", "Izinkan akses galeri untuk memilih gambar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.85,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    const gambar = await toUploadFile(asset, "sejarah.jpg", asset?.mimeType || "image/jpeg");
    setForm((current) => ({
      ...current,
      gambar,
    }));
  };

  const buildFormData = () => {
    console.log("[adminsejarah] buildFormData START");
    const data = new FormData();
    
    console.log("[adminsejarah] Appending deskripsi:", form.deskripsi.substring(0, 50));
    data.append("deskripsi", form.deskripsi);
    
    console.log("[adminsejarah] Appending gambar file...");
    appendFileToFormData(data, "gambar", form.gambar);
    
    console.log("[adminsejarah] buildFormData END - FormData ready");
    return data;
  };

  const submitForm = async () => {
    if (!form.deskripsi) {
      Alert.alert("Deskripsi kosong", "Isi deskripsi terlebih dahulu.");
      return;
    }

    if (mode === "create" && !form.gambar) {
      Alert.alert("Gambar kosong", "Pilih gambar terlebih dahulu.");
      return;
    }

    try {
      setSaving(true);
      console.log("[adminsejarah] submitForm START");
      console.log("[adminsejarah] Mode:", mode);
      console.log("[adminsejarah] Form data:", {
        deskripsi: form.deskripsi.substring(0, 50),
        gambar: form.gambar ? { name: form.gambar.name, type: form.gambar.type } : null,
      });

      if (mode === "create") {
        console.log("[adminsejarah] Creating new item");
        await createAdminItem("sejarah", buildFormData());
      } else {
        console.log("[adminsejarah] Updating item:", getItemId(selected));
        await updateAdminItem("sejarah", getItemId(selected), buildFormData());
      }

      console.log("[adminsejarah] submitForm SUCCESS");
      setModalVisible(false);
      await loadData();
    } catch (err) {
      console.error("[adminsejarah] submitForm ERROR:", err);
      console.error("[adminsejarah] Error message:", err.message);
      Alert.alert(
        "Gagal menyimpan",
        `${err.message}\n\nLihat console untuk detail lengkap.`
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSelected = () => {
    if (!selected) {
      Alert.alert("Pilih data", "Pilih satu data terlebih dahulu.");
      return;
    }

    Alert.alert("Hapus data", "Data sejarah yang dipilih akan dihapus.", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAdminItem("sejarah", getItemId(selected));
            setSelected(null);
            await loadData();
          } catch (err) {
            Alert.alert("Gagal menghapus", err.message || "Data belum dihapus.");
          }
        },
      },
    ]);
  };

  const refreshData = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/dashboardadmin")}
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sejarah HKBP Tanjung Pinang</Text>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color="#FFFFFF" />
          <Text style={styles.stateText}>Memuat sejarah...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
          }
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

          {!error && items.length === 0 ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>Belum ada data.</Text>
            </View>
          ) : null}

          {items.slice(0, 1).map((item, index) => {
            const imageUrl = getImageUrl(item);
            const isSelected = getItemId(selected) === getItemId(item);

            return (
              <TouchableOpacity
                key={String(getItemId(item) || index)}
                style={[styles.card, isSelected && styles.selectedCard]}
                activeOpacity={0.85}
                onPress={() => setSelected(item)}
              >
                <Image
                  source={
                    imageUrl
                      ? { uri: imageUrl }
                      : require("../assets/images/gereja.jpeg")
                  }
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <Text style={styles.paragraph}>{getItemDescription(item)}</Text>
              </TouchableOpacity>
            );
          })}

          {items.length > 1 ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                Ada {items.length - 1} data sejarah tambahan di database. Layar
                ini hanya mengelola satu data utama.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={deleteSelected}>
          <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Hapus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={openEdit}>
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Ubah</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={openCreate}>
          <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {mode === "create" ? "Tambah Sejarah" : "Ubah Sejarah"}
            </Text>

            <FormPickerField
              label="Deskripsi"
              mode="text"
              icon="document-text-outline"
              placeholder="Masukkan deskripsi sejarah"
              multiline
              value={form.deskripsi}
              onChange={(deskripsi) =>
                setForm((current) => ({ ...current, deskripsi }))
              }
            />

            <TouchableOpacity style={styles.fileButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={22} color="#FFFFFF" />
              <Text style={styles.fileButtonText}>
                {form.gambar?.name || "Pilih Gambar"}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={submitForm}
                disabled={saving}
              >
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>
                  {saving ? "Menyimpan..." : "Simpan"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  backButton: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flexShrink: 1,
  },

  scrollContent: {
    paddingHorizontal: 14,
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
    fontWeight: "700",
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },

  selectedCard: {
    borderColor: "#000080",
  },

  cardImage: {
    width: "100%",
    height: 250,
    borderRadius: 6,
    marginBottom: 14,
  },

  paragraph: {
    width: "100%",
    fontSize: 14,
    lineHeight: 24,
    color: "#222",
    textAlign: "justify",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginHorizontal: 14,
    marginBottom: 24,
  },

  actionButton: {
    backgroundColor: "#000080",
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    flexDirection: "row",
    gap: 6,
  },

  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    padding: 18,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },

  fileButton: {
    backgroundColor: "#000080",
    borderRadius: 6,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  fileButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 18,
  },

  modalButton: {
    flex: 1,
    backgroundColor: "#000080",
    borderRadius: 6,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  cancelButton: {
    backgroundColor: "#777777",
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
