import axios from "axios";

const apiBase = (import.meta.env.VITE_API_URL || "").trim();

export const http = axios.create({
  baseURL: `${apiBase}/api`,
  timeout: 15000
});

export function setAuthToken(token) {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
}
