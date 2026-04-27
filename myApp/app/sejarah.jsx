import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function SejarahScreen() {
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
              Awal mula jemaat HKBP di Tanjung Pinang tidak dapat dipastikan secara
              tepat, tetapi diketahui bahwa orang-orang Batak Kristen pada masa itu
              beribadah bersama umat Kristen dari berbagai suku lain seperti Ambon,
              Manado, Jawa, dan suku lainnya di gereja yang dikenal sebagai Vierde
              Kerk di Jalan Gereja No. 1 Tanjung Pinang. Gereja ini disebut-sebut
              berkaitan dengan berbagai latar sejarah, dan pada sekitar tahun 1950
              menjadi tempat berkumpulnya jemaat yang kemudian menjadi cikal bakal
              berdirinya HKBP di Tanjung Pinang.
            </Text>

            <Text style={styles.paragraph}>
              Pada akhir tahun 1950, Pdt. M. Pakpahan dari HKBP Distrik
              Jawa-Kalimantan datang ke Tanjung Pinang dan disambut baik oleh jemaat
              asal HKBP. Namun, keinginan agar beliau memimpin Sakramen Baptisan dan
              Perjamuan Kudus terhambat karena adanya larangan penggunaan bahasa
              Batak dan syarat pemeriksaan teks khotbah oleh pihak Vierde Kerk.
              Situasi ini mendorong jemaat asal HKBP membentuk panitia pendirian
              gereja dengan pengurus pertama yang dipimpin K. Hasibuan dan P.
              Nainggolan. Dari proses inilah HKBP Tanjung Pinang resmi berdiri pada
              7 Oktober 1951 dengan sekitar 20 kepala keluarga, lalu diresmikan oleh
              pimpinan pusat HKBP pada Januari 1952 sebagai bagian dari Ressort
              Singapura dan Distrik Jawa-Kalimantan.
            </Text>
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

  paragraph: {
    width: "100%",
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