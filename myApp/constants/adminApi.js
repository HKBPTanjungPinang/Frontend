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
  // Return in-memory token jika tersedia (paling cepat)
  if (sessionToken) {
    console.log("[getStoredTokenAsync] Returning in-memory token");
    return sessionToken;
  }

  // Try AsyncStorage (mobile)
  if (asyncStorageAvailable && AsyncStorage) {
    try {
      console.log("[getStoredTokenAsync] Reading from AsyncStorage");
      const token = await AsyncStorage.getItem("adminToken");
      if (token) {
        sessionToken = token;
        console.log("[getStoredTokenAsync] Token found in AsyncStorage:", token.substring(0, 20) + "...");
        return token;
      }
    } catch (_err) {
      console.error("[getStoredTokenAsync] AsyncStorage error:", _err.message);
    }
  }

  // Fall back ke localStorage (web)
  if (typeof localStorage !== "undefined") {
    try {
      console.log("[getStoredTokenAsync] Reading from localStorage");
      const token = localStorage.getItem("adminToken") || "";
      if (token) {
        sessionToken = token;
        console.log("[getStoredTokenAsync] Token found in localStorage:", token.substring(0, 20) + "...");
        return token;
      }
    } catch (_err) {
      console.error("[getStoredTokenAsync] localStorage error:", _err.message);
    }
  }

  console.log("[getStoredTokenAsync] No token found");
  return "";
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
  console.log("[buildHeaders] START");
  const token = await getStoredTokenAsync();

  console.log("[buildHeaders] Token available:", !!token);

  const defaultHeaders = {
    ...headers,
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
    console.log("[buildHeaders] Added Authorization header");
  } else {
    console.warn("[buildHeaders] WARNING: No token available!");
  }

  // Don't set Content-Type for FormData - let the browser/RN handle it
  if (isFormData && defaultHeaders["Content-Type"]) {
    delete defaultHeaders["Content-Type"];
    console.log("[buildHeaders] Removed Content-Type for FormData");
  }

  console.log("[buildHeaders] Final headers:", Object.keys(defaultHeaders));
  return defaultHeaders;
};

const adminFetch = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  let response;
  let errorDetails = "";

  try {
    const headers = await buildHeaders(options.headers, isFormData);
    const url = buildApiUrl(path);
    
    console.log(`[adminFetch] START ${options.method || "GET"} ${url}`);
    console.log(`[adminFetch] isFormData: ${isFormData}`);
    
    if (isFormData) {
      console.log(`[adminFetch] FormData detected - will be sent as multipart/form-data`);
    }

    const fetchOptions = {
      ...options,
      headers,
    };

    console.log(`[adminFetch] Fetch options keys:`, Object.keys(fetchOptions));
    console.log(`[adminFetch] Sending request...`);

    response = await fetch(url, fetchOptions);
    
    console.log(`[adminFetch] Response received with status: ${response.status}`);
  } catch (err) {
    errorDetails = `${err.name}: ${err.message}`;
    console.error("[adminFetch] FETCH ERROR:", errorDetails);
    console.error("[adminFetch] Error stack:", err.stack);
    
    // Provide more specific error message
    if (err.message.includes("Network") || err.message.includes("Failed")) {
      throw new Error(`Network error: ${err.message}`);
    }
    if (err.message.includes("timeout")) {
      throw new Error(`Request timeout - server tidak merespons. Pastikan backend aktif.`);
    }
    
    throw new Error(`Request gagal: ${err.message}`);
  }

  let payload;
  try {
    const text = await response.text();
    console.log(`[adminFetch] Response body length: ${text.length} bytes`);
    
    if (text) {
      try {
        payload = JSON.parse(text);
        console.log(`[adminFetch] JSON parsed successfully`);
      } catch (parseErr) {
        console.error("[adminFetch] JSON parse failed, raw response:", text.substring(0, 200));
        payload = null;
      }
    } else {
      console.log(`[adminFetch] Response body is empty`);
      payload = null;
    }
  } catch (err) {
    console.error("[adminFetch] Error reading response body:", err.message);
    payload = null;
  }

  if (!response.ok) {
    const errorMsg = payload?.message || 
                     payload?.error || 
                     response.statusText ||
                     `HTTP ${response.status}`;
    
    console.error("[adminFetch] Response not ok:", {
      status: response.status,
      statusText: response.statusText,
      payload,
    });
    
    throw new Error(`Server error (${response.status}): ${errorMsg}`);
  }

  console.log(`[adminFetch] SUCCESS`);
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

export const appendFileToFormData = (formData, fieldName, fileData) => {
  if (!fileData) {
    console.log(`[appendFileToFormData] No file data for field: ${fieldName}`);
    return;
  }
  
  console.log(`[appendFileToFormData] Processing field: ${fieldName}`);
  console.log(`[appendFileToFormData] File data keys:`, Object.keys(fileData));
  console.log(`[appendFileToFormData] File data:`, {
    name: fileData.name,
    type: fileData.type,
    uri: fileData.uri ? fileData.uri.substring(0, 50) : null,
    hasFile: !!fileData.file,
  });

  const { file, name, type, uri } = fileData;
  
  // For React Native: prefer URI directly
  if (uri) {
    console.log(`[appendFileToFormData] Using URI format for RN: ${uri.substring(0, 50)}...`);
    try {
      // React Native FormData accepts { uri, name, type }
      formData.append(fieldName, {
        uri,
        name,
        type: type || 'application/octet-stream',
      });
      console.log(`[appendFileToFormData] Successfully appended via URI`);
      return;
    } catch (err) {
      console.error(`[appendFileToFormData] Error appending URI:`, err.message);
      console.log(`[appendFileToFormData] Falling back to file object...`);
    }
  }
  
  // For web: use File object
  if (file instanceof File) {
    console.log(`[appendFileToFormData] Using File object (web)`);
    try {
      formData.append(fieldName, file, name);
      console.log(`[appendFileToFormData] Successfully appended File`);
      return;
    } catch (err) {
      console.error(`[appendFileToFormData] Error appending File:`, err.message);
    }
  }
  
  // Fallback: try Blob
  if (file instanceof Blob) {
    console.log(`[appendFileToFormData] Using Blob object`);
    try {
      formData.append(fieldName, file, name);
      console.log(`[appendFileToFormData] Successfully appended Blob`);
      return;
    } catch (err) {
      console.error(`[appendFileToFormData] Error appending Blob:`, err.message);
    }
  }
  
  // Last resort: direct append
  if (file) {
    console.log(`[appendFileToFormData] Using direct append (unknown type)`);
    try {
      formData.append(fieldName, file);
      console.log(`[appendFileToFormData] Successfully appended directly`);
      return;
    } catch (err) {
      console.error(`[appendFileToFormData] Error appending directly:`, err.message);
    }
  }
  
  console.warn(`[appendFileToFormData] No valid file found for field: ${fieldName}`);
};

export const toUploadFile = async (asset, fallbackName, fallbackType) => {
  console.log(`[toUploadFile] START - fallbackName: ${fallbackName}, fallbackType: ${fallbackType}`);
  
  if (!asset) {
    console.warn(`[toUploadFile] Asset is null/undefined`);
    return null;
  }

  console.log(`[toUploadFile] Asset type:`, typeof asset);
  console.log(`[toUploadFile] Asset keys:`, Object.keys(asset || {}));

  const name = buildFileName(asset, fallbackName);
  const type = buildFileType(asset, fallbackType);

  console.log(`[toUploadFile] Resolved name: ${name}`);
  console.log(`[toUploadFile] Resolved type: ${type}`);
  console.log(`[toUploadFile] Asset has file:`, !!asset.file);
  console.log(`[toUploadFile] Asset has uri:`, !!asset.uri);

  // For web: use File object directly
  if (asset.file) {
    console.log(`[toUploadFile] Using web File object`);
    return {
      file: asset.file,
      name,
      type: type || asset.file.type,
    };
  }

  // For mobile: use URI directly without converting to Blob
  if (asset.uri) {
    console.log(`[toUploadFile] Using mobile URI: ${asset.uri.substring(0, 60)}...`);
    return {
      uri: asset.uri, // Keep URI for FormData
      file: null,
      name,
      type: type || "application/octet-stream",
    };
  }

  console.error(`[toUploadFile] ERROR: No file or uri in asset`);
  throw new Error("File asset tidak valid - tidak memiliki file atau uri");
};
