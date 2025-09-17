// src/pages/RevoxAppDetails.tsx
import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppDetailsTable } from "@/components/app-details/AppDetailsTable";
import { DataExtractionLoader } from "@/components/app-details/DataExtractionLoader";
import { ThemeSamplesDialog } from "@/components/app-details/ThemeSamplesDialog";
import { AnalysisPeriodPicker } from "@/components/app-details/AnalysisPeriodPicker";
import { AlertsInterface } from "@/components/app-details/AlertsInterface";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Search,
  Download,
  RefreshCw,
  X,
  Plus,
  Apple,
  Bot,
  Link as LinkIcon,
  Unlink,
  CalendarIcon,
  Bell,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { api, appPkFromRoute, getReviewsExportUrl, linkApps, unlinkApps, markAppAsRead, fetchThemes, type ThemesResponse } from "@/api";

// -------- Types alignés avec le backend --------
type ReviewItem = {
  app_name?: string;
  platform: "ios" | "android";
  date: string;            // ISO
  rating: number;          // 1..5
  text?: string;
  user_name?: string;
  app_version?: string;
  bundle_id: string;
};

type ReviewsResponse = {
  items: ReviewItem[];
  nextCursor?: string | null;
  count?: number;
};

type FollowedApp = {
  bundleId: string;
  platform: "ios" | "android";
  name?: string | null;
  icon?: string | null;
  rating?: number | null;
  reviewsThisWeek?: number | null;
  linked_app_pks?: string[] | null;
};

// No mock data - use skeletons during loading

const mockPositiveThemes = [
  { theme: "User Interface", percentage: 89 },
  { theme: "Performance", percentage: 76 },
  { theme: "Features", percentage: 64 },
];
const mockNegativeThemes = [
  { theme: "Crashes", percentage: 34 },
  { theme: "Sync Issues", percentage: 28 },
  { theme: "Battery Drain", percentage: 19 },
];

const LIMIT = 10;

export default function RevoxAppDetails() {
  const navigate = useNavigate();
  const { platform, bundleId } = useParams<{ platform: "ios" | "android"; bundleId: string }>();

  const truncate = (s?: string, n = 80) => (s && s.length > n ? s.slice(0, n) + "..." : s || "");

  // Get app_pks from URL parameters for merged apps
  const urlParams = new URLSearchParams(window.location.search);
  const urlAppPks = urlParams.get('app_pks')?.split(',').filter(Boolean) || [];

  // No mock data - use loading state instead
  const [appDataLoading, setAppDataLoading] = useState(true);

  // Reviews + pagination
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isFirstTimeExtraction, setIsFirstTimeExtraction] = useState(false);
  const [showExtractionLoader, setShowExtractionLoader] = useState(false);

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Linking state
  const [linkedApps, setLinkedApps] = useState<FollowedApp[]>([]);
  const [availableApps, setAvailableApps] = useState<FollowedApp[]>([]);
  const [currentApp, setCurrentApp] = useState<FollowedApp | null>(null);
  const [linkingLoading, setLinkingLoading] = useState(false);

  // Themes state
  const [themesData, setThemesData] = useState<ThemesResponse | null>(null);
  const [themesLoading, setThemesLoading] = useState(false);
  
  // Date range state for analysis period
  const [analysisFromDate, setAnalysisFromDate] = useState<Date>(() => subMonths(new Date(), 3));
  const [analysisToDate, setAnalysisToDate] = useState<Date>(new Date());

  // Filtres UI (client)
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "ios" | "android">("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | "1" | "2" | "3" | "4" | "5">("all");

  // Dialog state
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<{ theme: any; type: "positive" | "negative" } | null>(null);

  // Use real app data from API when available
  const displayApp = currentApp ? {
    name: currentApp.name || bundleId || 'Unknown App',
    icon: currentApp.icon,
    version: (currentApp as any).version || 'Unknown',
    rating: currentApp.rating || 0,
    latestUpdate: (currentApp as any).releaseNotes || 'No update information available.',
    lastUpdatedAt: (currentApp as any).lastUpdatedAt
  } : null;

  // Load app info and linking data
  const loadAppData = async () => {
    if (!platform || !bundleId) return;

    setAppDataLoading(true);
    try {
      const { data } = await api.get("/follow-app");
      const followedApps = (data?.followed as FollowedApp[]) ?? [];

      const current = followedApps.find(
        (app) => app.platform === platform && app.bundleId === bundleId
      );

      if (current) {
        setCurrentApp(current);

        // Find linked apps
        const linkedAppPks = current.linked_app_pks || [];
        const linked = followedApps.filter((app) => {
          const appPk = appPkFromRoute(app.platform, app.bundleId);
          return linkedAppPks.includes(appPk);
        });
        setLinkedApps(linked);

        // Find available apps for linking (opposite platform, not already linked)
        const available = followedApps.filter((app) => {
          if (app.platform === platform) return false;
          const appPk = appPkFromRoute(app.platform, app.bundleId);
          return !linkedAppPks.includes(appPk);
        });
        setAvailableApps(available);
      }
    } catch (e: any) {
      console.error("Failed to load app data:", e);
    } finally {
      setAppDataLoading(false);
    }
  };

  // Load themes data
  const loadThemesData = async (fromDate?: Date, toDate?: Date) => {
    if (!platform || !bundleId) return;

    setThemesLoading(true);
    try {
      // Always use URL app_pks if available (for merged apps), otherwise construct from current + linked apps
      let appPkParam: string;
      if (urlAppPks.length > 0) {
        // URL contains the merged app_pks - use them directly
        appPkParam = urlAppPks.join(",");
      } else {
        // Construct from current app + any linked apps
        const allAppPks = [appPkFromRoute(platform, bundleId)];
        if (linkedApps.length > 0) {
          allAppPks.push(...linkedApps.map(app => appPkFromRoute(app.platform, app.bundleId)));
        }
        appPkParam = allAppPks.join(",");
      }

      const fromDateStr = fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined;
      const toDateStr = toDate ? format(toDate, 'yyyy-MM-dd') : undefined;

      const data = await fetchThemes(appPkParam, fromDateStr, toDateStr);
      setThemesData(data);
    } catch (e: any) {
      console.error("Failed to load themes data:", e);
      setThemesData(null);
    } finally {
      setThemesLoading(false);
    }
  };

  // --- Chargement initial (reset) ---
  async function fetchReviewsInitial() {
    if (!platform || !bundleId) return;
    if (!refreshing) setLoading(true);
    setErr(null);
    try {
      // Always use URL app_pks if available (for merged apps), otherwise construct from current + linked apps
      let appPkParam: string;
      if (urlAppPks.length > 0) {
        // URL contains the merged app_pks - use them directly
        appPkParam = urlAppPks.join(",");
      } else {
        // Construct from current app + any linked apps
        const allAppPks = [appPkFromRoute(platform, bundleId)];
        if (linkedApps.length > 0) {
          allAppPks.push(...linkedApps.map(app => appPkFromRoute(app.platform, app.bundleId)));
        }
        appPkParam = allAppPks.join(",");
      }

      const { data } = await api.get<ReviewsResponse>("/reviews", {
        params: {
          app_pk: appPkParam,
          limit: LIMIT,
          order: "desc",
        },
      });
      const rows = (data?.items ?? []) as ReviewItem[];
      setReviews(rows);
      const next = data?.nextCursor || undefined;
      setCursor(next);
      setHasMore(!!next);

      // Show extraction loader if no results and not already refreshing (first time)
      if (rows.length === 0 && !refreshing && !isFirstTimeExtraction) {
        setIsFirstTimeExtraction(true);
        setShowExtractionLoader(true);
      }

      // Mark app as read after successfully loading reviews with content
      if (rows.length > 0 && platform && bundleId) {
        try {
          // For merged apps, mark all apps as read
          const appsToMarkRead: Array<{ platform: "ios" | "android"; bundleId: string }> = [];
          
          if (urlAppPks.length > 0) {
            // URL contains merged app_pks - extract platform and bundleId from each
            urlAppPks.forEach(appPk => {
              const [appPlatform, appBundleId] = appPk.split('#');
              if (appPlatform && appBundleId && (appPlatform === 'ios' || appPlatform === 'android')) {
                appsToMarkRead.push({ platform: appPlatform, bundleId: appBundleId });
              }
            });
          } else {
            // Single app or construct from current + linked
            appsToMarkRead.push({ platform, bundleId });
            linkedApps.forEach(linkedApp => {
              appsToMarkRead.push({ platform: linkedApp.platform, bundleId: linkedApp.bundleId });
            });
          }

          // Make separate API calls for each app
          await Promise.all(
            appsToMarkRead.map(app => markAppAsRead(app.platform, app.bundleId))
          );
        } catch (error) {
          console.error("Failed to mark app(s) as read:", error);
        }
      }
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to load reviews.");
      setReviews([]);
      setCursor(undefined);
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // --- Pages suivantes ---
  async function fetchReviewsMore() {
    if (!platform || !bundleId) return;
    if (!hasMore || !cursor || loadingMore) return;

    setLoadingMore(true);
    try {
      // Always use URL app_pks if available (for merged apps), otherwise construct from current + linked apps
      let appPkParam: string;
      if (urlAppPks.length > 0) {
        // URL contains the merged app_pks - use them directly
        appPkParam = urlAppPks.join(",");
      } else {
        // Construct from current app + any linked apps
        const allAppPks = [appPkFromRoute(platform, bundleId)];
        if (linkedApps.length > 0) {
          allAppPks.push(...linkedApps.map(app => appPkFromRoute(app.platform, app.bundleId)));
        }
        appPkParam = allAppPks.join(",");
      }

      const { data } = await api.get<ReviewsResponse>("/reviews", {
        params: {
          app_pk: appPkParam,
          limit: LIMIT,
          order: "desc",
          cursor, // opaque, renvoyé tel quel
        },
      });
      const rows = (data?.items ?? []) as ReviewItem[];
      setReviews((prev) => [...prev, ...rows]);
      const next = data?.nextCursor || undefined;
      setCursor(next);
      setHasMore(!!next);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to load more reviews.");
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadAppData();
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [platform, bundleId]);

  useEffect(() => {
    fetchReviewsInitial();
    // Only load themes initially, not on date changes
    loadThemesData(analysisFromDate, analysisToDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, bundleId, linkedApps.length, urlAppPks.join(',')]);

  // Handle extraction loader completion
  const handleExtractionComplete = () => {
    setShowExtractionLoader(false);
    setRefreshing(true);
    handleRefresh();
  };

  // Ingest (refresh) → POST puis reset
  const handleRefresh = async () => {
    if (!platform || !bundleId) return;
    setRefreshing(true);
    try {
      await api.post("/reviews/ingest", {
        appName: displayApp?.name || bundleId,
        platform,
        bundleId,
        backfillDays: 2,
      });
      await fetchReviewsInitial();
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to refresh (ingest) reviews.");
      setRefreshing(false);
    }
  };

  // Export CSV → GET blob + download
  const handleExport = async () => {
    if (!platform || !bundleId) return;
    try {
      // Always use URL app_pks if available (for merged apps), otherwise construct from current + linked apps
      let appPk: string;
      if (urlAppPks.length > 0) {
        // URL contains the merged app_pks - use them directly
        appPk = urlAppPks.join(",");
      } else {
        // Construct from current app + any linked apps
        const allAppPks = [appPkFromRoute(platform, bundleId)];
        if (linkedApps.length > 0) {
          allAppPks.push(...linkedApps.map(app => appPkFromRoute(app.platform, app.bundleId)));
        }
        appPk = allAppPks.join(",");
      }

      const urlPath = getReviewsExportUrl({
        app_pk: appPk,
        order: "desc",
      });
      const resp = await api.get(urlPath, { responseType: "blob" });
      const blob = new Blob([resp.data], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(displayApp?.name || bundleId).replace(/[^a-zA-Z0-9]/g, '_')}_export.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to export reviews.");
    }
  };

  // Link app handler
  const handleLinkApp = async (targetApp: FollowedApp) => {
    if (!currentApp) return;

    setLinkingLoading(true);
    try {
      const currentAppPk = appPkFromRoute(currentApp.platform, currentApp.bundleId);
      const targetAppPk = appPkFromRoute(targetApp.platform, targetApp.bundleId);

      await linkApps(currentAppPk, targetAppPk);
      await loadAppData();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to link apps.");
    } finally {
      setLinkingLoading(false);
    }
  };

  // Unlink app handler
  const handleUnlinkApp = async () => {
    if (!currentApp || linkedApps.length === 0) return;

    setLinkingLoading(true);
    try {
      const currentAppPk = appPkFromRoute(currentApp.platform, currentApp.bundleId);
      const linkedAppPk = appPkFromRoute(linkedApps[0].platform, linkedApps[0].bundleId);

      await unlinkApps(currentAppPk, linkedAppPk);
      await loadAppData();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to unlink apps.");
    } finally {
      setLinkingLoading(false);
    }
  };

  const filteredReviews = useMemo(() => {
    let out = reviews;

    if (platformFilter !== "all") {
      out = out.filter((r) => r.platform === platformFilter);
    }
    if (ratingFilter !== "all") {
      const r = parseInt(ratingFilter, 10);
      out = out.filter((it) => Number(it.rating) === r);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      out = out.filter(
        (it) =>
          (it.user_name || "").toLowerCase().includes(q) ||
          (it.text || "").toLowerCase().includes(q)
      );
    }
    return out;
  }, [reviews, searchTerm, platformFilter, ratingFilter]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
          }`}
      />
    ));

  return (
    <Layout showTopbar={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/revox/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              {appDataLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <h1 className="font-semibold text-lg">{displayApp?.name || bundleId}</h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-4 sm:space-y-6">
          {/* App Info */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {appDataLoading ? (
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0">
                        <Skeleton className="w-20 h-20 rounded-2xl" />
                      </div>
                      <div className="flex-1 space-y-3 sm:space-y-4">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <Skeleton className="h-8 w-48" />
                            <div className="flex items-center gap-2 flex-wrap">
                              <Skeleton className="h-6 w-20" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </div>
                    </div>
                  ) : displayApp ? (
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          {displayApp.icon ? (
                            <img
                              src={displayApp.icon}
                              alt={displayApp.name}
                              className="w-20 h-20 rounded-2xl border-2 border-border/50 shadow-sm"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border-2 border-border/50 flex items-center justify-center">
                              <span className="text-2xl font-bold text-muted-foreground">
                                {displayApp.name.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                          {linkedApps.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <LinkIcon className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-3 sm:space-y-4">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h2 className="text-xl sm:text-2xl font-bold">{displayApp.name}</h2>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                {platform === "ios" ? <Apple className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                {platform?.toUpperCase()}
                              </Badge>
                              {linkedApps.map((linkedApp) => (
                                <Badge key={linkedApp.bundleId} variant="secondary" className="flex items-center gap-1">
                                  {linkedApp.platform === "ios" ? <Apple className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                  {linkedApp.platform.toUpperCase()}
                                </Badge>
                              ))}
                              {linkedApps.length > 0 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleUnlinkApp}
                                  disabled={linkingLoading}
                                  className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-destructive"
                                  title="Unlink apps"
                                >
                                  <Unlink className="h-3 w-3" />
                                  Unlink
                                </Button>
                              )}
                              {linkedApps.length === 0 && availableApps.length > 0 && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      disabled={linkingLoading}
                                      className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-primary"
                                      title="Link with counterpart app"
                                    >
                                      <Plus className="h-3 w-3" />
                                      Link
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    {availableApps.map((availableApp) => (
                                      <DropdownMenuItem
                                        key={`${availableApp.platform}-${availableApp.bundleId}`}
                                        onClick={() => handleLinkApp(availableApp)}
                                        className="gap-2"
                                      >
                                        {availableApp.platform === "ios" ? (
                                          <Apple className="h-4 w-4" />
                                        ) : (
                                          <Bot className="h-4 w-4" />
                                        )}
                                        {availableApp.name || availableApp.bundleId}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        </div>

                        <AppDetailsTable
                          currentApp={{
                            name: displayApp.name,
                            version: displayApp.version,
                            rating: displayApp.rating,
                            latestUpdate: displayApp.latestUpdate,
                            lastUpdatedAt: displayApp.lastUpdatedAt,
                            platform: platform!,
                            bundleId: bundleId!
                          }}
                          linkedApps={linkedApps.map(linkedApp => ({
                            name: linkedApp.name || linkedApp.bundleId,
                            version: (linkedApp as any).version || "Unknown",
                            rating: linkedApp.rating || 4.1,
                            latestUpdate: (linkedApp as any).releaseNotes ||
                              `Enhanced ${linkedApp.platform === 'ios' ? 'iOS' : 'Android'} compatibility and bug fixes for better performance.`,
                            lastUpdatedAt: (linkedApp as any).lastUpdatedAt,
                            platform: linkedApp.platform,
                            bundleId: linkedApp.bundleId
                          }))}
                          className="mt-4"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
                <AlertsInterface />
              </div>
            </CardContent>
          </Card>

          {/* Theme Analysis and Alert Status */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Theme Analysis */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    Theme Analysis
                  </CardTitle>
                  <AnalysisPeriodPicker
                    fromDate={analysisFromDate}
                    toDate={analysisToDate}
                    onFromDateChange={setAnalysisFromDate}
                    onToDateChange={setAnalysisToDate}
                    onValidate={() => loadThemesData(analysisFromDate, analysisToDate)}
                    reviewsCount={themesData?.total_reviews_considered}
                    lastUpdated={themesData?.created_at}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Positive Themes */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-base font-medium text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      Top 3 Positive Themes
                    </h3>
                    <div className="space-y-3">
                      {themesLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-3 border rounded-lg">
                              <Skeleton className="h-4 w-full" />
                            </div>
                          ))}
                        </div>
                      ) : themesData && themesData.top_positive_axes.length > 0 ? (
                        <div className="space-y-3">
                          {themesData.top_positive_axes.slice(0, 3).map((theme, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedTheme({ theme, type: "positive" })}
                              className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 hover:border-green-200 transition-all duration-200 group"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                <span className="text-sm text-foreground group-hover:text-green-700 transition-colors">
                                  {theme.axis_label}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 ml-4">
                                Click to view sample comments
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p className="text-sm">No positive themes data available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Negative Themes */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-base font-medium text-orange-600">
                      <TrendingDown className="h-4 w-4" />
                      Top 3 Negative Themes
                    </h3>
                    <div className="space-y-3">
                      {themesLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-3 border rounded-lg">
                              <Skeleton className="h-4 w-full" />
                            </div>
                          ))}
                        </div>
                      ) : themesData && themesData.top_negative_axes.length > 0 ? (
                        <div className="space-y-3">
                          {themesData.top_negative_axes.slice(0, 3).map((theme, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedTheme({ theme, type: "negative" })}
                              className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 hover:border-orange-200 transition-all duration-200 group"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                                <span className="text-sm text-foreground group-hover:text-orange-700 transition-colors">
                                  {theme.axis_label}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 ml-4">
                                Click to view sample comments
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p className="text-sm">No negative themes data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Theme Samples Dialog */}
          <ThemeSamplesDialog
            theme={selectedTheme?.theme || null}
            type={selectedTheme?.type || "positive"}
            open={!!selectedTheme}
            onOpenChange={(open) => !open && setSelectedTheme(null)}
          />

          {/* Reviews */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Reviews
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleRefresh} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtres UI */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={platformFilter} onValueChange={(v: any) => setPlatformFilter(v)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="ios">iOS</SelectItem>
                    <SelectItem value="android">Android</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ratingFilter} onValueChange={(v: any) => setRatingFilter(v)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Liste */}
              {showExtractionLoader ? (
                <DataExtractionLoader 
                  appName={displayApp?.name || bundleId}
                  platform={platform}
                  onComplete={handleExtractionComplete}
                />
              ) : loading ? (
                <div className="space-y-4 animate-fade-in">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : null}

              {refreshing && !loading && (
                <div className="text-sm text-muted-foreground flex items-center gap-2 animate-fade-in">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Refreshing reviews...
                </div>
              )}

              {!loading && !refreshing && err && (
                <div className="text-sm text-red-600 border p-3 rounded animate-fade-in">{err}</div>
              )}

              {!loading && !refreshing && !err && (
                <div className="animate-fade-in">
                  {filteredReviews.length > 0 ? (
                    <>
                      <ScrollArea className="h-96">
                        <div className="space-y-4 pr-4">
                          {filteredReviews.map((r, idx) => (
                            <div key={`${r.date}-${idx}`} className="border rounded-lg p-4 space-y-3 hover-scale">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium text-sm">
                                    {(r.user_name || "?").charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium">{r.user_name || "Anonymous"}</span>
                                      <Badge variant="secondary" className="flex items-center gap-1 h-5 text-xs">
                                        {r.platform === "ios" ? <Apple className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                        {r.platform === "ios" ? "iOS" : "Android"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(r.date).toLocaleString("fr-FR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false
                                  }).replace(" ", " • ")}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex">{renderStars(Number(r.rating))}</div>
                                <span className="text-sm text-muted-foreground">
                                  {Number(r.rating)}/5
                                </span>
                              </div>

                              {r.text && (
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {r.text}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Pagination / Load more */}
                      {hasMore && (
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={fetchReviewsMore}
                            disabled={loadingMore}
                          >
                            {loadingMore ? "Loading…" : `Load more (${LIMIT})`}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No reviews found.</p>
                      <p className="text-xs mt-1">Reviews will automatically refresh in a moment...</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}