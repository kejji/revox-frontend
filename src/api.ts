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

export type SearchAppItem = {
  store: "ios" | "android";
  name: string;
  bundleId: string;
  icon?: string;
};

export async function searchApps(query: string): Promise<SearchAppItem[]> {
  const { data } = await api.get<SearchAppItem[]>("/search-app", {
    params: { query },
  });
  return data ?? [];
}

/** Normalise un app_pk à partir de la route /:platform/:bundleId */
export function appPkFromRoute(platform: "ios" | "android", bundleId: string) {
  return `${platform}#${bundleId}`;
}

/** Encode app_pk for URL query params (# -> %23) */
export function encodeAppPk(appPk: string): string {
  return appPk.replace(/#/g, "%23");
}

/** Create comma-separated encoded app_pk for multi-app queries */
export function encodeMultiAppPk(appPks: string[]): string {
  return appPks.map(encodeAppPk).join(",");
}

/** Link two apps together */
export async function linkApps(appPk1: string, appPk2: string): Promise<void> {
  await api.post("/apps/merge", {
    app_pks: [appPk1, appPk2],
  });
}

/** Unlink two apps */
export async function unlinkApps(appPk1: string, appPk2: string): Promise<void> {
  await api.delete("/apps/merge", {
    data: {
      app_pks: [appPk1, appPk2],
    },
  });
}

/** Construit l'URL d'export CSV (sans cursor) */
export function getReviewsExportUrl(params: {
  app_pk: string;
  from?: string;
  to?: string;
  order?: "asc" | "desc";
}) {
  const qp = new URLSearchParams();
  // Encode app_pk for URL
  const encodedParams = {
    ...params,
    app_pk: encodeAppPk(params.app_pk),
    order: params.order ?? "desc",
  };
  Object.entries(encodedParams).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qp.set(k, String(v));
  });
  return `/reviews/export?${qp.toString()}`;
}