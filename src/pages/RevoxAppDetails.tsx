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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Settings,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { api, appPkFromRoute, getReviewsExportUrl, linkApps, unlinkApps, markAppAsRead, fetchThemes, fetchThemesResult, type ThemesResponse, type ThemeAxis } from "@/api";
import { ThemeAnalysisSection } from "@/components/app-details/ThemeAnalysisSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { doSignOut } from "@/lib/auth";
import { getCurrentUser } from "aws-amplify/auth";

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
  const { t } = useLanguage();

  const truncate = (s?: string, n = 80) => (s && s.length > n ? s.slice(0, n) + "..." : s || "");

  // User info state
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  // Get app_pks from URL parameters for merged apps
  const urlParams = new URLSearchParams(window.location.search);
  const urlAppPks = urlParams.get('app_pks')?.split(',').filter(Boolean) || [];

  // No mock data - use loading state instead
  const [appDataLoading, setAppDataLoading] = useState(true);
  const [themesLoading, setThemesLoading] = useState(true);

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

  // Themes state - moved to ThemeAnalysisSection component
  
  // Date range state for analysis period
  const [analysisFromDate, setAnalysisFromDate] = useState<Date>(() => subMonths(new Date(), 3));
  const [analysisToDate, setAnalysisToDate] = useState<Date>(new Date());

  // Filtres UI (client)
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "ios" | "android">("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | "1" | "2" | "3" | "4" | "5">("all");

  // Dialog state
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<{ theme: ThemeAxis; type: "positive" | "negative" } | null>(null);

  // Use real app data from API when available
  const displayApp = currentApp ? {
    name: currentApp.name || bundleId || 'Unknown App',
    icon: currentApp.icon,
    version: (currentApp as any).version || 'Unknown',
    rating: currentApp.rating || 0,
    latestUpdate: (currentApp as any).releaseNotes || 'No update information available.',
    lastUpdatedAt: (currentApp as any).lastUpdatedAt
  } : null;

  // Load user info
  const loadUserInfo = async () => {
    try {
      const user = await getCurrentUser();
      setUserName(user.signInDetails?.loginId || "");
      setUserEmail(user.signInDetails?.loginId || "");
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  };

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

  // Get app_pk for themes (moved to ThemeAnalysisSection)
  const getAppPkParam = () => {
    if (urlAppPks.length > 0) {
      return urlAppPks.join(",");
    } else {
      const allAppPks = [appPkFromRoute(platform!, bundleId!)];
      if (linkedApps.length > 0) {
        allAppPks.push(...linkedApps.map(app => appPkFromRoute(app.platform, app.bundleId)));
      }
      return allAppPks.join(",");
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
      // After reviews are loaded, allow themes to load
      setThemesLoading(false);
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
    const loadSequentially = async () => {
      // First load user info and reviews
      await loadUserInfo();
      await fetchReviewsInitial();
      // Then load app data after reviews are loaded
      await loadAppData();
    };

    loadSequentially();
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [platform, bundleId]);

  // Separate effect for when linkedApps change (e.g., after linking/unlinking)
  useEffect(() => {
    if (linkedApps.length >= 0) { // Allow 0 length to trigger refresh after unlinking
      fetchReviewsInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedApps.length, urlAppPks.join(',')]); 

  // Handle extraction loader completion
  const handleExtractionComplete = () => {
    setShowExtractionLoader(false);
    setRefreshing(true);
    setThemesLoading(true); // Reset themes loading when refreshing
    handleRefresh();
  };

  // Ingest (refresh) → POST puis reset
  const handleRefresh = async () => {
    if (!platform || !bundleId) return;
    setRefreshing(true);
    setThemesLoading(true); // Reset themes loading
    try {
      await api.post("/reviews/ingest", {
        appName: displayApp?.name || bundleId,
        platform,
        bundleId,
        backfillDays: 2,
      });
      await fetchReviewsInitial(); // This will set themesLoading to false when complete
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to refresh (ingest) reviews.");
      setRefreshing(false);
      setThemesLoading(false);
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

  // Initials for avatar fallback
  const initials = (() => {
    const source = (userName || userEmail || "").trim();
    if (!source) return "U";
    // if email, take part before @
    const text = source.includes("@") ? source.split("@")[0] : source;
    const parts = text.split(/[.\s_-]+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase() || first.toUpperCase() || "U";
  })();

  return (
    <Layout showTopbar={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/revox/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              {appDataLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <h1 className="font-semibold text-lg truncate">{displayApp?.name || bundleId}</h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={userName || userEmail || "User"} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userName || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {userEmail || "—"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    {t('settings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => doSignOut(navigate)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-6 sm:space-y-8">
          {/* App Info */}
          <section className="space-y-4">
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
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h2 className="text-xl sm:text-2xl font-bold">{displayApp.name}</h2>
                      </div>
                      
                       {/* Subtle Rating Display */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 text-sm">
                        {/* Current App Rating */}
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1">
                            {platform === "ios" ? <Apple className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                            {platform === "ios" ? "iOS" : "Android"}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {renderStars(Math.floor(displayApp.rating))}
                            <span className="text-muted-foreground ml-1">{displayApp.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        {/* Unlink Button - positioned between ratings */}
                        {linkedApps.length > 0 && (
                          <div className="flex justify-center sm:justify-start">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleUnlinkApp}
                              disabled={linkingLoading}
                              className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-destructive border border-dashed border-muted-foreground/30 hover:border-destructive/50"
                              title="Unlink these apps"
                            >
                              <Unlink className="h-3 w-3" />
                              <span>Unlink</span>
                            </Button>
                          </div>
                        )}
                        
                        {/* Linked App Rating */}
                        {linkedApps.length > 0 && linkedApps[0].rating && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1">
                              {linkedApps[0].platform === "ios" ? <Apple className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                              {linkedApps[0].platform === "ios" ? "iOS" : "Android"}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {renderStars(Math.floor(linkedApps[0].rating))}
                              <span className="text-muted-foreground ml-1">{linkedApps[0].rating.toFixed(1)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs flex items-center">
                          {platform === "ios" ? <Apple className="h-3 w-3 mr-1" /> : <Bot className="h-3 w-3 mr-1" />}
                          {platform?.toUpperCase()}
                        </Badge>
                        {linkedApps.map((linkedApp) => (
                          <Badge key={linkedApp.bundleId} variant="outline" className="text-xs flex items-center">
                            {linkedApp.platform === "ios" ? <Apple className="h-3 w-3 mr-1" /> : <Bot className="h-3 w-3 mr-1" />}
                            {linkedApp.platform.toUpperCase()}
                          </Badge>
                        ))}
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
                                <span className="hidden sm:inline">Link</span>
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
                        <AlertsInterface />
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
          </section>

          {/* Theme Analysis */}
          {platform && bundleId && (
            <>
              {themesLoading ? (
                <section className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Skeleton className="h-7 w-32" />
                    <Skeleton className="h-10 w-48" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          <Skeleton className="h-6 w-24" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600 flex items-center gap-2">
                          <TrendingDown className="h-5 w-5" />
                          <Skeleton className="h-6 w-24" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </section>
              ) : (
                <ThemeAnalysisSection
                  appPk={getAppPkParam()}
                  appName={displayApp?.name || bundleId}
                  onThemeClick={setSelectedTheme}
                  analysisFromDate={analysisFromDate}
                  analysisToDate={analysisToDate}
                  onFromDateChange={setAnalysisFromDate}
                  onToDateChange={setAnalysisToDate}
                  onValidate={() => {/* Theme analysis validation handled inside component */}}
                />
              )}
            </>
          )}

          {/* Theme Samples Dialog */}
          <ThemeSamplesDialog
            theme={selectedTheme?.theme || null}
            type={selectedTheme?.type || "positive"}
            open={!!selectedTheme}
            onOpenChange={(open) => !open && setSelectedTheme(null)}
          />

          {/* Reviews */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleRefresh} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Filtres UI */}
              <div className="flex flex-col sm:flex-row gap-4">
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
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 border border-border/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Skeleton key={j} className="h-4 w-4" />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : filteredReviews.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {filteredReviews.map((review, i) => (
                      <div key={i} className="p-4 border border-border/50 rounded-lg hover:border-border transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {review.user_name || "Anonymous"}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {review.platform === "ios" ? <Apple className="h-3 w-3 mr-1" /> : <Bot className="h-3 w-3 mr-1" />}
                              {review.platform.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{format(new Date(review.date), "MMM d, yyyy")}</span>
                            {review.app_version && (
                              <>
                                <span>•</span>
                                <span>v{review.app_version}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {review.rating}/5
                          </span>
                        </div>
                        {review.text && (
                          <p className="text-sm text-foreground leading-relaxed">
                            {truncate(review.text, 300)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {hasMore && (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
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
          </section>
        </div>
      </div>
    </Layout>
  );
}