// app/lib/api.js

// const API_URL = "http://127.0.0.1:5000/api";
const API_URL = "http://127.0.0.1:8000/api";
// const API_URL = "https://54.147.145.228/api";

const TOKEN_KEY = "aw_admin_token";
const USER_KEY = "aw_admin_user";

let inMemoryToken = null;
let inMemoryUser = null;

// =============== TOKEN HELPERS ===============

export function setToken(token) {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken() {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      inMemoryToken = stored;
      return stored;
    }
  }
  return null;
}

export function clearToken() {
  inMemoryToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// =============== USER HELPERS ===============

export function setCurrentUser(user) {
  inMemoryUser = user;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // ignore JSON errors
    }
  }
}

export function getCurrentUser() {
  if (inMemoryUser) return inMemoryUser;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      inMemoryUser = parsed;
      return parsed;
    } catch {
      return null;
    }
  }
  return null;
}

export function clearCurrentUser() {
  inMemoryUser = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

// =============== API FETCH ===============

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    throw error;
  }

  return data;
}
