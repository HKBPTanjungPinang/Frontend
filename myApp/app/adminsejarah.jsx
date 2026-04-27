import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminSejarahScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#000080", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/dashboardadmin")}
          >
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Sejarah HKBP Tanjung Pinang</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/gereja.jpeg")}
              style={styles.churchImage}
              resizeMode="cover"
            />

            <Text style={styles.paragraph}>
              Awal mula jemaat HKBP di Tanjung Pinang tidak dapat dipastikan
              secara tepat, tetapi diketahui bahwa orang-orang Batak Kristen
              pada masa itu beribadah bersama umat Kristen dari berbagai suku
              lain seperti Ambon, Manado, Jawa, dan suku lainnya di gereja yang
              dikenal sebagai Vierde Kerk di Jalan Gereja No. 1 Tanjung Pinang.
              Gereja ini disebut-sebut berkaitan dengan berbagai latar sejarah,
              dan pada sekitar tahun 1950 menjadi tempat berkumpulnya jemaat
              yang kemudian menjadi cikal bakal berdirinya HKBP di Tanjung
              Pinang.
            </Text>

            <Text style={styles.paragraph}>
              Pada akhir tahun 1950, Pdt. M. Pakpahan dari HKBP Distrik
              Jawa-Kalimantan datang ke Tanjung Pinang dan disambut baik oleh
              jemaat asal HKBP. Namun, keinginan agar beliau memimpin Sakramen
              Baptisan dan Perjamuan Kudus terhambat karena adanya larangan
              penggunaan bahasa Batak dan syarat pemeriksaan teks khotbah oleh
              pihak Vierde Kerk. Situasi ini mendorong jemaat asal HKBP
              membentuk panitia pendirian gereja dengan pengurus pertama yang
              dipimpin K. Hasibuan dan P. Nainggolan. Dari proses inilah HKBP
              Tanjung Pinang resmi berdiri pada 7 Oktober 1951 dengan sekitar 20
              kepala keluarga, lalu diresmikan oleh pimpinan pusat HKBP pada
              Januari 1952 sebagai bagian dari Ressort Singapura dan Distrik
              Jawa-Kalimantan.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Ubah</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
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
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flexShrink: 1,
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

  paragraph: {
    width: "100%",
    fontSize: 14,
    lineHeight: 24,
    color: "#222",
    textAlign: "justify",
    marginBottom: 16,
  },

  buttonRow: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },

  actionButton: {
    backgroundColor: "#000080",
    width: 95,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },

  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
