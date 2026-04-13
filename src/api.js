import axios from "axios";
import { useAuthStore } from "./store/authStore";

const api = axios.create({
  baseURL: "https://film-management-api.labse.id/api/v1",
});

// Ini sihirnya: Otomatis menyelipkan Token JWT ke setiap request jika user sudah login
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
