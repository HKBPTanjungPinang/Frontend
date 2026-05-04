import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createAdminItem,
  deleteAdminItem,
  getAdminList,
  toUploadFile,
  updateAdminItem,
} from "../constants/adminApi";
import {
  getItemDate,
  getItemId,
  getItemTitle,
  openFileView,
} from "../constants/publicApi";

const emptyForm = {
  tanggal: "",
  lokasi: "",
  waktu: "",
  file: null,
};

export default function AdminPdfManagerScreen({
  category,
  title,
  showLocationFields = false,
  gradient = ["#000080", "#FFFFFF"],
}) {
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
      const data = await getAdminList(category);
      setItems(data);
      setSelected((current) => {
        if (!current) return null;
        const currentId = getItemId(current);
        return data.find((item) => getItemId(item) === currentId) || null;
      });
    } catch (err) {
      setError(err.message || "Data admin belum bisa dimuat");
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

  const openCreate = () => {
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
      tanggal: selected.tanggal || "",
      lokasi: selected.lokasi || "",
      waktu: selected.waktu || "",
      file: null,
    });
    setModalVisible(true);
  };

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    setForm((current) => ({
      ...current,
      file: toUploadFile(asset, "dokumen.pdf", "application/pdf"),
    }));
  };

  const buildFormData = () => {
    const data = new FormData();
    data.append("tanggal", form.tanggal);

    if (showLocationFields) {
      data.append("lokasi", form.lokasi);
      data.append("waktu", form.waktu);
    }

    if (form.file) {
      data.append("file", form.file);
    }

    return data;
  };

  const submitForm = async () => {
    if (!form.tanggal) {
      Alert.alert("Tanggal kosong", "Isi tanggal terlebih dahulu.");
      return;
    }

    if (mode === "create" && !form.file) {
      Alert.alert("PDF kosong", "Pilih file PDF terlebih dahulu.");
      return;
    }

    try {
      setSaving(true);

      if (mode === "create") {
        await createAdminItem(category, buildFormData());
      } else {
        await updateAdminItem(category, getItemId(selected), buildFormData());
      }

      setModalVisible(false);
      await loadData();
    } catch (err) {
      Alert.alert("Gagal menyimpan", err.message || "Data belum tersimpan.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSelected = () => {
    if (!selected) {
      Alert.alert("Pilih data", "Pilih satu data terlebih dahulu.");
      return;
    }

    Alert.alert("Hapus data", "Data yang dipilih akan dihapus.", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAdminItem(category, getItemId(selected));
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
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
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
            const isSelected = getItemId(selected) === getItemId(item);

            return (
              <TouchableOpacity
                key={String(id)}
                style={[styles.pdfCard, isSelected && styles.selectedCard]}
                activeOpacity={0.85}
                onPress={() => setSelected(item)}
                onLongPress={() => openFileView(category, getItemId(item))}
              >
                <MaterialIcons name="picture-as-pdf" size={28} color="black" />

                <View style={styles.cardTextGroup}>
                  <Text style={styles.pdfText} numberOfLines={1}>
                    {getItemTitle(item, `${title} ${index + 1}`)}
                  </Text>
                  <Text style={styles.metaText} numberOfLines={1}>
                    {[getItemDate(item), item.lokasi, item.waktu]
                      .filter(Boolean)
                      .join(" - ")}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.bottomButtonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={deleteSelected}>
          <Text style={styles.actionButtonText}>Hapus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={openEdit}>
          <Text style={styles.actionButtonText}>Ubah</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={openCreate}>
          <Text style={styles.actionButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {mode === "create" ? "Tambah Data" : "Ubah Data"}
            </Text>

            <Text style={styles.inputLabel}>Tanggal</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={form.tanggal}
              onChangeText={(tanggal) =>
                setForm((current) => ({ ...current, tanggal }))
              }
            />

            {showLocationFields ? (
              <>
                <Text style={styles.inputLabel}>Lokasi</Text>
                <TextInput
                  style={styles.input}
                  value={form.lokasi}
                  onChangeText={(lokasi) =>
                    setForm((current) => ({ ...current, lokasi }))
                  }
                />

                <Text style={styles.inputLabel}>Waktu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="19:00"
                  value={form.waktu}
                  onChangeText={(waktu) =>
                    setForm((current) => ({ ...current, waktu }))
                  }
                />
              </>
            ) : null}

            <TouchableOpacity style={styles.fileButton} onPress={pickPdf}>
              <MaterialIcons name="picture-as-pdf" size={22} color="#FFFFFF" />
              <Text style={styles.fileButtonText}>
                {form.file?.name || "Pilih PDF"}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={submitForm}
                disabled={saving}
              >
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
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },

  selectedCard: {
    borderColor: "#000080",
  },

  cardTextGroup: {
    flex: 1,
    marginLeft: 12,
  },

  pdfText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  metaText: {
    marginTop: 4,
    fontSize: 12,
    color: "#333333",
  },

  bottomButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 10,
  },

  actionButton: {
    backgroundColor: "#0000A8",
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  actionButtonText: {
    color: "#FFFFFF",
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

  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 15,
    color: "#000",
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
    alignItems: "center",
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
