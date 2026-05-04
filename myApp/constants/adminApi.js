import {
  buildApiUrl,
  getItemId,
  getPublicEndpoint,
  normalizeItem,
  normalizeList,
  PUBLIC_ENDPOINTS,
} from "./publicApi";

let sessionToken = "";

const getStoredToken = () => {
  if (sessionToken) return sessionToken;

  if (typeof localStorage !== "undefined") {
    sessionToken = localStorage.getItem("adminToken") || "";
  }

  return sessionToken;
};

export const setAdminToken = (token) => {
  sessionToken = token || "";

  if (typeof localStorage !== "undefined") {
    if (sessionToken) {
      localStorage.setItem("adminToken", sessionToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }
};

export const getAdminToken = getStoredToken;

export const logoutAdmin = () => setAdminToken("");

const extractToken = (payload) =>
  payload?.token ||
  payload?.access_token ||
  payload?.accessToken ||
  payload?.jwt ||
  payload?.data?.token ||
  payload?.data?.access_token ||
  payload?.data?.accessToken ||
  payload?.data?.jwt ||
  "";

export const loginAdmin = async ({ email, password }) => {
  const response = await fetch(buildApiUrl("/api/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Login admin gagal");
  }

  const token = extractToken(payload);

  if (!token) {
    throw new Error("Login berhasil, tetapi token admin tidak ditemukan");
  }

  setAdminToken(token);
  return payload;
};

const buildHeaders = (headers = {}, isFormData = false) => {
  const token = getStoredToken();

  const defaultHeaders = {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Don't set Content-Type for FormData - let the browser handle it
  if (isFormData && defaultHeaders["Content-Type"]) {
    delete defaultHeaders["Content-Type"];
  }

  return defaultHeaders;
};

const adminFetch = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: buildHeaders(options.headers, isFormData),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || payload?.error || `Request gagal dengan status ${response.status}`
    );
  }

  return payload;
};

export const getAdminList = async (category) =>
  normalizeList(await adminFetch(getPublicEndpoint(category)));

export const createAdminItem = async (category, formData) =>
  normalizeItem(
    await adminFetch(getPublicEndpoint(category), {
      method: "POST",
      body: formData,
    })
  );

export const updateAdminItem = async (category, id, formData) =>
  normalizeItem(
    await adminFetch(`${getPublicEndpoint(category)}/${id}`, {
      method: "PUT",
      body: formData,
    })
  );

export const deleteAdminItem = async (category, id) =>
  adminFetch(`${getPublicEndpoint(category)}/${id}`, {
    method: "DELETE",
  });

export const clearAllAdminData = async () => {
  const categories = Object.keys(PUBLIC_ENDPOINTS);
  const deleted = [];

  for (const category of categories) {
    const items = await getAdminList(category);

    for (const item of items) {
      const id = getItemId(item);

      if (id !== undefined && id !== null) {
        await deleteAdminItem(category, id);
        deleted.push({ category, id });
      }
    }
  }

  return deleted;
};

export const toUploadFile = (asset, fallbackName, fallbackType) => {
  if (!asset) return null;

  return {
    uri: asset.uri,
    name: asset.name || asset.fileName || fallbackName,
    type: asset.mimeType || fallbackType,
  };
};
