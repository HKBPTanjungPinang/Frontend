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
    getItemDate,
    getItemId,
    getItemTitle,
    openFileView,
} from "../constants/publicApi";
import DateSearchBar from "./DateSearchBar";
import FormPickerField from "./FormPickerField";

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
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    const file = await toUploadFile(asset, "dokumen.pdf", "application/pdf");
    setForm((current) => ({
      ...current,
      file,
    }));
  };

  const buildFormData = () => {
    console.log(`[AdminPdfManagerScreen-${category}] buildFormData START`);
    const data = new FormData();
    
    console.log(`[AdminPdfManagerScreen-${category}] Appending tanggal: ${form.tanggal}`);
    data.append("tanggal", form.tanggal);

    if (showLocationFields) {
      console.log(`[AdminPdfManagerScreen-${category}] Appending lokasi: ${form.lokasi}`);
      data.append("lokasi", form.lokasi);
      console.log(`[AdminPdfManagerScreen-${category}] Appending waktu: ${form.waktu}`);
      data.append("waktu", form.waktu);
    }

    console.log(`[AdminPdfManagerScreen-${category}] Appending file...`);
    appendFileToFormData(data, "file", form.file);

    console.log(`[AdminPdfManagerScreen-${category}] buildFormData END - FormData ready`);
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
      console.log(`[AdminPdfManagerScreen-${category}] submitForm START`);
      console.log(`[AdminPdfManagerScreen-${category}] Mode:`, mode);
      console.log(`[AdminPdfManagerScreen-${category}] Form data:`, {
        tanggal: form.tanggal,
        lokasi: form.lokasi,
        waktu: form.waktu,
        file: form.file ? { name: form.file.name, type: form.file.type } : null,
      });

      if (mode === "create") {
        console.log(`[AdminPdfManagerScreen-${category}] Creating new item`);
        await createAdminItem(category, buildFormData());
      } else {
        console.log(`[AdminPdfManagerScreen-${category}] Updating item:`, getItemId(selected));
        await updateAdminItem(category, getItemId(selected), buildFormData());
      }

      console.log(`[AdminPdfManagerScreen-${category}] submitForm SUCCESS`);
      setModalVisible(false);
      await loadData();
    } catch (err) {
      console.error(`[AdminPdfManagerScreen-${category}] submitForm ERROR:`, err);
      console.error(`[AdminPdfManagerScreen-${category}] Error message:`, err.message);
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

  const handleDateChange = (date) => {
    setSearchDate(date);
    setCurrentPage(1);
  };

  // Filter items by search date
  const filteredItems = searchDate
    ? items.filter((item) => {
        const itemDate = getItemDate(item) || "";
        return itemDate.includes(searchDate);
      })
    : items;

  // Pagination
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
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
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
            const isSelected = getItemId(selected) === getItemId(item);
            const titleIndex = (currentPage - 1) * itemsPerPage + index + 1;
            const metaParts = showFullMeta
              ? [getItemDate(item), item.waktu, item.lokasi]
              : [getItemDate(item)];

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
                    {getItemTitle(item, `${title} ${titleIndex}`)}
                  </Text>
                  <Text style={styles.metaText} numberOfLines={1}>
                    {metaParts.filter(Boolean).join(" - ")}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {totalPages > 1 && (
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
          )}
        </ScrollView>
      )}

      <View style={styles.bottomButtonRow}>
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
              {mode === "create" ? "Tambah Data" : "Ubah Data"}
            </Text>

            <FormPickerField
              label="Tanggal"
              mode="date"
              placeholder="Pilih tanggal"
              value={form.tanggal}
              onChange={(tanggal) =>
                setForm((current) => ({ ...current, tanggal }))
              }
            />

            {showLocationFields ? (
              <>
                <FormPickerField
                  label="Lokasi"
                  mode="text"
                  icon="location-outline"
                  placeholder="Masukkan lokasi"
                  value={form.lokasi}
                  onChange={(lokasi) =>
                    setForm((current) => ({ ...current, lokasi }))
                  }
                />

                <FormPickerField
                  label="Waktu"
                  mode="time"
                  placeholder="Pilih waktu"
                  value={form.waktu}
                  onChange={(waktu) =>
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
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    flexDirection: "row",
    gap: 6,
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

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
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
