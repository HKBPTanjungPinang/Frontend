import {
    buildApiUrl,
    getItemId,
    getPublicEndpoint,
    normalizeItem,
    normalizeList,
    PUBLIC_ENDPOINTS,
} from "./publicApi";

let sessionToken = "";
let asyncStorageAvailable = false;
let AsyncStorage = null;

// Try to import AsyncStorage for mobile support
try {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
  asyncStorageAvailable = true;
} catch (_err) {
  asyncStorageAvailable = false;
}

const getStoredToken = () => {
  if (sessionToken) return sessionToken;

  // Try localStorage first (web)
  if (typeof localStorage !== "undefined") {
    sessionToken = localStorage.getItem("adminToken") || "";
  }

  return sessionToken;
};

const getStoredTokenAsync = async () => {
  if (sessionToken) return sessionToken;

  // Try AsyncStorage first (mobile)
  if (asyncStorageAvailable && AsyncStorage) {
    try {
      sessionToken = (await AsyncStorage.getItem("adminToken")) || "";
      return sessionToken;
    } catch (_err) {
      // Fall back to localStorage
    }
  }

  // Fall back to localStorage (web)
  if (typeof localStorage !== "undefined") {
    sessionToken = localStorage.getItem("adminToken") || "";
  }

  return sessionToken;
};

export const setAdminToken = (token) => {
  sessionToken = token || "";

  // Try AsyncStorage first (mobile)
  if (asyncStorageAvailable && AsyncStorage) {
    if (sessionToken) {
      AsyncStorage.setItem("adminToken", sessionToken).catch(() => {});
    } else {
      AsyncStorage.removeItem("adminToken").catch(() => {});
    }
  }

  // Also try localStorage (web)
  if (typeof localStorage !== "undefined") {
    if (sessionToken) {
      localStorage.setItem("adminToken", sessionToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }
};

export const getAdminToken = getStoredToken;
export const getAdminTokenAsync = getStoredTokenAsync;

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

export const loginAdmin = async ({ username, email, password }) => {
  const loginUsername = username || email;
  const response = await fetch(buildApiUrl("/api/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: loginUsername, password }),
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

const buildHeaders = async (headers = {}, isFormData = false) => {
  const token = await getStoredTokenAsync();

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
  let response;

  try {
    const headers = await buildHeaders(options.headers, isFormData);
    response = await fetch(buildApiUrl(path), {
      ...options,
      headers,
    });
  } catch (_err) {
    throw new Error(
      "Request gagal terkirim. Pastikan login admin masih aktif dan file upload valid."
    );
  }

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

const buildFileName = (asset, fallbackName) =>
  asset?.name || asset?.fileName || fallbackName;

const buildFileType = (asset, fallbackType) =>
  asset?.mimeType || asset?.type || fallbackType;

export const toUploadFile = async (asset, fallbackName, fallbackType) => {
  if (!asset) return null;

  const name = buildFileName(asset, fallbackName);
  const type = buildFileType(asset, fallbackType);

  // Use File object directly if available (web upload)
  if (asset.file) {
    return {
      file: asset.file,
      name,
      type: type || asset.file.type,
    };
  }

  // Fetch blob from URI if available (mobile or blob URI)
  if (asset.uri) {
    try {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      
      // For mobile (React Native), just return the blob directly
      // FormData.append will handle it properly
      const mimeType = blob.type || type || "application/octet-stream";
      
      // Return blob with metadata for FormData
      return {
        file: blob,
        name,
        type: mimeType,
      };
    } catch (error) {
      console.error("Error fetching file from URI:", error);
      throw new Error(`Gagal membaca file: ${error.message}`);
    }
  }

  throw new Error("File asset tidak valid - tidak memiliki file atau uri");
};
