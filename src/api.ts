// src/api.ts
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {/* pas d'erreur bloquante */}
  return config;
});
