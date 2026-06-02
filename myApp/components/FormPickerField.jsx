import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

export default function FormPickerField({
  label,
  value,
  onChange,
  mode = "text",
  placeholder,
  icon,
  multiline = false,
}) {
  const [visible, setVisible] = useState(false);
  const [viewDate, setViewDate] = useState(() => fromDateValue(value));
  const [timeDraft, setTimeDraft] = useState(value || "19:00");

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = Array(firstDay).fill(null);

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [viewDate]);

  const openPicker = () => {
    if (mode === "date") setViewDate(fromDateValue(value));
    if (mode === "time") setTimeDraft(value || "19:00");
    setVisible(true);
  };

  const moveMonth = (offset) => {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
  };

  if (mode === "text") {
    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.inputShell, multiline && styles.textAreaShell]}>
          {icon ? (
            <Ionicons name={icon} size={20} color="#000080" />
          ) : null}
          <TextInput
            style={[styles.input, multiline && styles.textArea]}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={value}
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            onChangeText={onChange}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity style={styles.inputShell} onPress={openPicker}>
        <Ionicons
          name={mode === "date" ? "calendar-outline" : "time-outline"}
          size={20}
          color="#000080"
        />
        <Text style={[styles.pickerValue, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#000080" />
      </TouchableOpacity>

      <Modal visible={visible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            {mode === "date" ? (
              <>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => moveMonth(-1)}
                  >
                    <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.monthTitle}>
                    {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </Text>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => moveMonth(1)}
                  >
                    <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
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
                    const selected = dateValue && dateValue === value;

                    return (
                      <TouchableOpacity
                        key={`${dateValue}-${index}`}
                        style={[styles.dayCell, selected && styles.selectedDay]}
                        disabled={!date}
                        onPress={() => {
                          onChange(toDateValue(date));
                          setVisible(false);
                        }}
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
              </>
            ) : (
              <View>
                <Text style={styles.timeTitle}>Pilih Waktu</Text>
                <View style={styles.timePickerContainer}>
                  <View style={styles.timeColumnContainer}>
                    <Text style={styles.timeColumnLabel}>Jam</Text>
                    <ScrollView
                      style={styles.timeScrollView}
                      showsVerticalScrollIndicator={true}
                      scrollEventThrottle={16}
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                        const hourStr = String(hour).padStart(2, "0");
                        const isSelected = timeDraft.startsWith(hourStr);
                        return (
                          <TouchableOpacity
                            key={`hour-${hour}`}
                            style={[
                              styles.timeOption,
                              isSelected && styles.timeOptionSelected,
                            ]}
                            onPress={() => {
                              const [, min] = timeDraft.split(":");
                              const newMin = min || "00";
                              setTimeDraft(`${hourStr}:${newMin}`);
                            }}
                          >
                            <Text
                              style={[
                                styles.timeOptionText,
                                isSelected && styles.timeOptionTextSelected,
                              ]}
                            >
                              {hourStr}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  <Text style={styles.timeSeparator}>:</Text>

                  <View style={styles.timeColumnContainer}>
                    <Text style={styles.timeColumnLabel}>Menit</Text>
                    <ScrollView
                      style={styles.timeScrollView}
                      showsVerticalScrollIndicator={true}
                      scrollEventThrottle={16}
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => {
                        const minuteStr = String(minute).padStart(2, "0");
                        const [hour] = timeDraft.split(":");
                        const isSelected = timeDraft.endsWith(minuteStr);
                        return (
                          <TouchableOpacity
                            key={`minute-${minute}`}
                            style={[
                              styles.timeOption,
                              isSelected && styles.timeOptionSelected,
                            ]}
                            onPress={() => {
                              const selectedHour = hour || "00";
                              setTimeDraft(`${selectedHour}:${minuteStr}`);
                            }}
                          >
                            <Text
                              style={[
                                styles.timeOptionText,
                                isSelected && styles.timeOptionTextSelected,
                              ]}
                            >
                              {minuteStr}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={() => setVisible(false)}
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>

              {mode === "time" ? (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    onChange(timeDraft);
                    setVisible(false);
                  }}
                >
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  <Text style={styles.modalButtonText}>Pilih</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  inputShell: {
    minHeight: 46,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  textAreaShell: {
    minHeight: 130,
    alignItems: "flex-start",
    paddingTop: 12,
  },

  input: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    paddingVertical: 10,
  },

  textArea: {
    minHeight: 105,
    paddingTop: 0,
  },

  pickerValue: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },

  placeholder: {
    color: "#999",
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },

  pickerCard: {
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

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#000080",
    justifyContent: "center",
    alignItems: "center",
  },

  monthTitle: {
    flex: 1,
    color: "#000",
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
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyDayText: {
    color: "transparent",
  },

  selectedDayText: {
    color: "#FFFFFF",
  },

  timeTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
    height: 280,
  },

  timeColumnContainer: {
    flex: 1,
    alignItems: "center",
  },

  timeColumnLabel: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  timeScrollView: {
    flex: 1,
    width: "100%",
    maxHeight: 240,
  },

  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 4,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },

  timeOptionSelected: {
    backgroundColor: "#000080",
  },

  timeOptionText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  timeOptionTextSelected: {
    color: "#FFFFFF",
  },

  timeSeparator: {
    color: "#000",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
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
    backgroundColor: "#777777",
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
