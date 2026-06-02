import AdminPdfManagerScreen from "../components/AdminPdfManagerScreen";

export default function AdminPartangianganKeluargaScreen() {
  return (
    <AdminPdfManagerScreen
      category="partangiangan-keluarga"
      gradient={["#0000A8", "#E6E6E6"]}
      showLocationFields
      title="Acara Partangiangan Keluarga"
    />
  );
}
