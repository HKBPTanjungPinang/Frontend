import AdminPdfManagerScreen from "../components/AdminPdfManagerScreen";

export default function AdminDoaLingkunganScreen() {
  return (
    <AdminPdfManagerScreen
      category="partangiangan"
      gradient={["#0000A8", "#E6E6E6"]}
      showLocationFields
      title="Doa Lingkungan"
    />
  );
}
