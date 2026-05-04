import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const CLOUD_API_BASE_URL = "https://app-gereja-api.antonio-girsang.workers.dev";

export const API_BASE_URL =
  envBaseUrl ||
  Constants.expoConfig?.extra?.apiBaseUrl ||
  CLOUD_API_BASE_URL;

export const PUBLIC_ENDPOINTS = {
  "minggu-batak": "/api/minggu-batak",
  "minggu-indonesia": "/api/minggu-indonesia",
  partangiangan: "/api/partangiangan",
  kontemporer: "/api/kontemporer",
  tingting: "/api/tingting",
  sejarah: "/api/sejarah",
};

const trimSlash = (value) => String(value || "").replace(/\/+$/, "");

export const buildApiUrl = (path) => {
  const normalizedPath = String(path || "").startsWith("/")
    ? path
    : `/${path}`;

  return `${trimSlash(API_BASE_URL)}${normalizedPath}`;
};

export const getPublicEndpoint = (category) => {
  const endpoint = PUBLIC_ENDPOINTS[category];

  if (!endpoint) {
    throw new Error(`Endpoint publik unauthorized: ${category}`);
  }

  return endpoint;
};

export const getPublicList = async (category) => {
  const response = await fetch(buildApiUrl(getPublicEndpoint(category)));
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || payload?.error || "Gagal mengambil data dari server"
    );
  }

  return normalizeList(payload);
};

export const getPublicDetail = async (category, id) => {
  const response = await fetch(
    buildApiUrl(`${getPublicEndpoint(category)}/${id}`)
  );
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || payload?.error || "Gagal mengambil detail data"
    );
  }

  return normalizeItem(payload);
};

export const getFileViewUrl = (category, id) =>
  buildApiUrl(`${getPublicEndpoint(category)}/${id}/view`);

export const getFileDownloadUrl = (category, id) =>
  buildApiUrl(`${getPublicEndpoint(category)}/${id}/download`);

export const openFileView = async (category, id) => {
  await WebBrowser.openBrowserAsync(getFileViewUrl(category, id));
};

export const openFileDownload = async (category, id) => {
  const url = getFileDownloadUrl(category, id);
  const canOpen = await Linking.canOpenURL(url);

  if (canOpen) {
    await Linking.openURL(url);
    return;
  }

  await WebBrowser.openBrowserAsync(url);
};

export const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.value)) return payload.value;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (payload?.data && typeof payload.data === "object") return [payload.data];
  if (payload && typeof payload === "object") return [payload];

  return [];
};

export const normalizeItem = (payload) => {
  if (payload?.data && typeof payload.data === "object") return payload.data;
  return payload || {};
};

export const getItemId = (item) =>
  item?.id ?? item?._id ?? item?.uuid ?? item?.slug;

export const getItemTitle = (item, fallback = "Dokumen") =>
  item?.title ||
  item?.judul ||
  item?.nama ||
  item?.name ||
  item?.file_name ||
  item?.fileName ||
  item?.filename ||
  item?.originalName ||
  item?.tanggal ||
  fallback;

export const getItemDescription = (item) =>
  item?.deskripsi ||
  item?.description ||
  item?.isi ||
  item?.content ||
  item?.keterangan ||
  "";

export const getItemDate = (item) =>
  item?.tanggal ||
  item?.date ||
  item?.createdAt ||
  item?.created_at ||
  item?.updatedAt ||
  item?.updated_at ||
  "";
