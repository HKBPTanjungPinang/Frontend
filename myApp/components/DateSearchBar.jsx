import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const pad = (value) => String(value).padStart(2, "0");

const toDateValue = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const fromDateValue = (value) => {
  const [year, month, day] = String(value || "")
    .split("-")
    .map((part) => Number(part));

  if (!year || !month || !day) return new Date();

  return new Date(year, month - 1, day);
};

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function DateSearchBar({
  value,
  onChange,
  placeholder = "Cari tanggal",
}) {
  const [visible, setVisible] = useState(false);
  const [viewDate, setViewDate] = useState(() => fromDateValue(value));

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = Array(firstDay).fill(null);

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [viewDate]);

  const moveMonth = (offset) => {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
  };

  const selectDate = (date) => {
    onChange(toDateValue(date));
    setVisible(false);
  };

  const openPicker = () => {
    setViewDate(fromDateValue(value));
    setVisible(true);
  };

  const selectedValue = value || "";

  return (
    <>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={selectedValue}
          onChangeText={onChange}
        />
        {selectedValue ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onChange("")}
            accessibilityLabel="Hapus tanggal"
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={openPicker}
          accessibilityLabel="Pilih tanggal"
        >
          <Ionicons name="calendar-outline" size={21} color="#000080" />
        </TouchableOpacity>
      </View>

      <Modal visible={visible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => moveMonth(-1)}
              >
                <Ionicons name="chevron-back" size={22} color="#000080" />
              </TouchableOpacity>

              <Text style={styles.monthTitle}>
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </Text>

              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => moveMonth(1)}
              >
                <Ionicons name="chevron-forward" size={22} color="#000080" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekGrid}>
              {weekdays.map((weekday) => (
                <Text key={weekday} style={styles.weekday}>
                  {weekday}
                </Text>
              ))}
            </View>

            <View style={styles.dayGrid}>
              {days.map((date, index) => {
                const dateValue = date ? toDateValue(date) : "";
                const selected = dateValue && dateValue === selectedValue;

                return (
                  <TouchableOpacity
                    key={`${dateValue}-${index}`}
                    style={[styles.dayCell, selected && styles.selectedDay]}
                    disabled={!date}
                    onPress={() => selectDate(date)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !date && styles.emptyDayText,
                        selected && styles.selectedDayText,
                      ]}
                    >
                      {date ? date.getDate() : ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={() => {
                  onChange("");
                  setVisible(false);
                }}
              >
                <Ionicons name="refresh" size={18} color="#000000" />
                <Text style={styles.secondaryButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setVisible(false)}
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 18,
    paddingLeft: 12,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    minHeight: 46,
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000000",
  },

  iconButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#D9D9D9",
  },

  calendarButton: {
    width: 38,
    height: 34,
    borderRadius: 6,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },

  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  monthButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  monthTitle: {
    flex: 1,
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  weekGrid: {
    flexDirection: "row",
  },

  weekday: {
    width: `${100 / 7}%`,
    paddingVertical: 8,
    color: "#333333",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1.2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  selectedDay: {
    backgroundColor: "#000080",
  },

  dayText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyDayText: {
    color: "transparent",
  },

  selectedDayText: {
    color: "#FFFFFF",
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
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

  secondaryButton: {
    backgroundColor: "#D9D9D9",
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
});
