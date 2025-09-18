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

/** Mark app as read */
export async function markAppAsRead(platform: "ios" | "android", bundleId: string): Promise<void> {
  await api.put("/follow-app/mark-read", {
    platform,
    bundleId,
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
  const cleanParams = {
    ...params,
    order: params.order ?? "desc",
  };
  Object.entries(cleanParams).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qp.set(k, String(v));
  });
  return `/reviews/export?${qp.toString()}`;
}

/** Types for themes API */
export type ThemeExample = {
  date: string;
  rating: number;
  text: string;
};

export type ThemeAxis = {
  count: number;
  examples: ThemeExample[];
  axis_label: string;
  axis_id: string;
  avg_rating: number;
};

export type ThemesResponse = {
  ok: boolean;
  app_pk: string;
  sk: string;
  status?: "pending" | "done" | null;
  selection: {
    from: string;
    to: string;
  };
  total_reviews_considered: number;
  created_at: string;
  top_positive_axes: ThemeAxis[];
  top_negative_axes: ThemeAxis[];
};

/** Fetch latest themes for app(s) */
export async function fetchThemes(appPk: string, fromDate?: string, toDate?: string): Promise<ThemesResponse> {
  const params: Record<string, string> = { app_pk: appPk };
  
  const { data } = await api.get<ThemesResponse>("/themes/latest", {
    params,
  });
  return data;
}

/** Fetch themes result for app(s) - returns top 3 positive and negative themes */
export async function fetchThemesResult(appPk: string): Promise<ThemesResponse> {
  const { data } = await api.get<ThemesResponse>("/themes/result", {
    params: { app_pk: appPk },
  });
  return data;
}

/** Schedule theme analysis for app(s) with run_now option */
export async function scheduleThemeAnalysis(appPk: string, appName: string): Promise<{ job_id: string | null }> {
  const { data } = await api.put<{ job_id: string | null }>("/themes/schedule", 
    { 
      app_pk: appPk,
      appName: appName,
      enabled: true,
      interval_minutes: 1440
    },
    { params: { run_now: true } }
  );
  return data;
}

/** Launch theme analysis for app(s) */
export async function launchThemeAnalysis(appPk: string): Promise<void> {
  await api.post("/themes/analyze", {
    app_pk: appPk,
  });
}