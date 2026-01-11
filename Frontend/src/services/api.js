// Frontend/src/services/api.js

// Base URL for API - using Vite proxy "/api"
const BASE_URL = "/api";

// -------------------------
// Token Helpers
// -------------------------
const getToken = () => localStorage.getItem("token");

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const redirectToLogin = () => {
  // Avoid redirect loop
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// Decode JWT payload safely (no external libs)
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true; // if invalid token, treat as expired
  return decoded.exp * 1000 < Date.now();
}

// -------------------------
// Fetch Wrapper
// -------------------------
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Attach auth token if available & valid
  const token = getToken();
  if (token) {
    if (isTokenExpired(token)) {
      // Token expired -> logout + redirect
      clearAuth();
      redirectToLogin();
      throw { status: 401, error: "Session expired. Please login again." };
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Try to parse JSON safely
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // Auto logout on unauthorized/forbidden (invalid token / role mismatch)
  if (response.status === 401 || response.status === 403) {
    clearAuth();
    redirectToLogin();
    throw {
      status: response.status,
      error: data?.error || "Unauthorized. Please login again.",
      details: data?.details,
    };
  }

  if (!response.ok) {
    throw {
      status: response.status,
      ...data,
      error: data?.error || "Request failed",
    };
  }

  return data;
}

// -------------------------
// AUTH / USER API
// -------------------------
export async function signup(userData) {
  return apiFetch("/users/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function login(credentials) {
  const data = await apiFetch("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Store token on successful login
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user || null));
  }

  return data;
}

export function logout() {
  clearAuth();
  redirectToLogin();
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export async function getProfile() {
  return apiFetch("/users/profile");
}

export async function changePassword(passwordData) {
  return apiFetch("/users/change-password", {
    method: "PUT",
    body: JSON.stringify(passwordData),
  });
}

// -------------------------
// STORES API
// -------------------------
export async function getStores(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.order) query.append("order", params.order);

  const queryString = query.toString();
  return apiFetch(`/stores${queryString ? "?" + queryString : ""}`);
}

export async function createStore(storeData) {
  return apiFetch("/stores", {
    method: "POST",
    body: JSON.stringify(storeData),
  });
}

export async function getOwnerDashboard() {
  return apiFetch("/stores/my-dashboard");
}

// -------------------------
// RATINGS API
// -------------------------
export async function addRating(ratingData) {
  return apiFetch("/ratings", {
    method: "POST",
    body: JSON.stringify(ratingData),
  });
}

export async function modifyRating(ratingData) {
  return apiFetch("/ratings", {
    method: "PUT",
    body: JSON.stringify(ratingData),
  });
}

// -------------------------
// ADMIN API
// -------------------------
export async function getAdminDashboardStats() {
  return apiFetch("/admin/dashboard-stats");
}

export async function getAdminUsers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.role) query.append("role", params.role);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.order) query.append("order", params.order);

  const queryString = query.toString();
  return apiFetch(`/admin/users${queryString ? "?" + queryString : ""}`);
}

export async function adminCreateUser(userData) {
  return apiFetch("/admin/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}
