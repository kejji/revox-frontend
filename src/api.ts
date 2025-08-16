import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();

    if (token) {
      // Garantit un objet compatible Axios v1
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      // Deux cas possibles selon la forme réelle des headers :
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        // Fallback pour l'ancien format "plain object"
        (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch {
    // pas de token si non connecté
  }
  return config;
});