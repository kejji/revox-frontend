// src/pages/RevoxAppDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { api, appPkFromRoute, getReviewsExportUrl, linkApps, unlinkApps } from "@/api";

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

// Données d’en-tête (mock pour l’instant)
const mockApp = {
  name: "TaskFlow Pro",
  description:
    "A comprehensive task management app that helps teams collaborate efficiently and track project progress in real-time.",
  version: "2.3.1",
  rating: 4.2,
  totalReviews: 1847,
  latestUpdate:
    "Fixed critical bug with notification sync and improved performance on iOS 17.",
  platforms: ["ios", "android"] as const,
  icon: null as string | null,
};

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
const mockAlerts = [
  { id: 1, type: "warning" as const, message: "Rating drops below 4.0", active: true },
  { id: 2, type: "error" as const, message: "Crash mentions spike", active: true },
];

const LIMIT = 10;

export default function RevoxAppDetails() {
  const navigate = useNavigate();
  const { platform, bundleId } = useParams<{ platform: "ios" | "android"; bundleId: string }>();

  // Get app_pks from URL parameters for merged apps
  const urlParams = new URLSearchParams(window.location.search);
  const urlAppPks = urlParams.get('app_pks')?.split(',').filter(Boolean) || [];

  // Header app (mock)
  const [app] = useState(mockApp);

  // Reviews + pagination
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Linking state
  const [linkedApps, setLinkedApps] = useState<FollowedApp[]>([]);
  const [availableApps, setAvailableApps] = useState<FollowedApp[]>([]);
  const [currentApp, setCurrentApp] = useState<FollowedApp | null>(null);
  const [linkingLoading, setLinkingLoading] = useState(false);

  // Filtres UI (client)
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "ios" | "android">("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | "1" | "2" | "3" | "4" | "5">("all");
  
  // Dialog state
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Load app info and linking data
  const loadAppData = async () => {
    if (!platform || !bundleId) return;

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
    }
  };

  // --- Chargement initial (reset) ---
  async function fetchReviewsInitial() {
    if (!platform || !bundleId) return;
    if (!refreshing) setLoading(true);
    setErr(null);
    try {
      // Use URL app_pks if available (for merged apps), otherwise use current app + linked apps
      let appPkParam: string;
      if (urlAppPks.length > 0) {
        appPkParam = urlAppPks.join(",");
      } else if (linkedApps.length > 0) {
        const allAppPks = [
          appPkFromRoute(platform, bundleId),
          ...linkedApps.map(app => appPkFromRoute(app.platform, app.bundleId))
        ];
        appPkParam = allAppPks.join(",");
      } else {
        appPkParam = appPkFromRoute(platform, bundleId);
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

      // Auto-refresh if no results and not already refreshing
      if (rows.length === 0 && !refreshing) {
        setTimeout(() => {
          setRefreshing(true);
          handleRefresh();
        }, 2000);
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
      // Use URL app_pks if available (for merged apps), otherwise use current app + linked apps
      let appPkParam: string;
      if (urlAppPks.length > 0) {
        appPkParam = urlAppPks.join(",");
      } else if (linkedApps.length > 0) {
        const allAppPks = [
          appPkFromRoute(platform, bundleId),
          ...linkedApps.map(app => appPkFromRoute(app.platform, app.bundleId))
        ];
        appPkParam = allAppPks.join(",");
      } else {
        appPkParam = appPkFromRoute(platform, bundleId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, bundleId, urlAppPks.length > 0 ? urlAppPks.join(',') : linkedApps]);

  // Ingest (refresh) → POST puis reset
  const handleRefresh = async () => {
    if (!platform || !bundleId) return;
    setRefreshing(true);
    try {
      await api.post("/reviews/ingest", {
        appName: app?.name || bundleId,
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
      // Use URL app_pks if available (for merged apps), otherwise use current app + linked apps
      let appPk: string;
      if (urlAppPks.length > 0) {
        appPk = urlAppPks.join(",");
      } else if (linkedApps.length > 0) {
        const allAppPks = [
          appPkFromRoute(platform, bundleId),
          ...linkedApps.map(app => appPkFromRoute(app.platform, app.bundleId))
        ];
        appPk = allAppPks.join(",");
      } else {
        appPk = appPkFromRoute(platform, bundleId);
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
      a.download = `${app.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.csv`;
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
              <h1 className="font-semibold text-lg">{app.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </header>

        <div className="container mx-auto p-6 max-w-7xl space-y-6">
          {/* App Info (mock) */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    {app.icon ? (
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-20 h-20 rounded-2xl border-2 border-border/50 shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border-2 border-border/50 flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {app.name.substring(0, 2).toUpperCase()}
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

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{app.name}</h2>
                      <div className="flex items-center gap-2">
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

                  <div className="space-y-4">
                    {/* Current App Row */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {platform === "ios" ? <Apple className="h-4 w-4 text-muted-foreground" /> : <Bot className="h-4 w-4 text-muted-foreground" />}
                        <h3 className="font-medium text-sm text-muted-foreground">{platform?.toUpperCase()} App</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium text-xs text-muted-foreground mb-1">Version</h4>
                          <p className="font-medium">{app.version}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-xs text-muted-foreground mb-1">Rating</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(Math.floor(app.rating))}</div>
                            <span className="font-medium">{app.rating}</span>
                            <span className="text-sm text-muted-foreground">({app.totalReviews} reviews)</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h4 className="font-medium text-xs text-muted-foreground mb-1">Latest Update</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-sm truncate max-w-[200px]">{app.latestUpdate}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-muted-foreground hover:text-primary"
                              onClick={() => setShowUpdateDialog(true)}
                            >
                              Show more
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Linked Apps Rows */}
                    {linkedApps.map((linkedApp, index) => (
                      <div key={`${linkedApp.platform}-${linkedApp.bundleId}`} className="space-y-3 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          {linkedApp.platform === "ios" ? <Apple className="h-4 w-4 text-muted-foreground" /> : <Bot className="h-4 w-4 text-muted-foreground" />}
                          <h3 className="font-medium text-sm text-muted-foreground">{linkedApp.platform.toUpperCase()} App</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-medium text-xs text-muted-foreground mb-1">Version</h4>
                            <p className="font-medium">2.3.1</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-xs text-muted-foreground mb-1">Rating</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex">{renderStars(linkedApp.rating || 4)}</div>
                              <span className="font-medium">{linkedApp.rating || "4.1"}</span>
                              <span className="text-sm text-muted-foreground">({linkedApp.reviewsThisWeek || 892} reviews)</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <h4 className="font-medium text-xs text-muted-foreground mb-1">Latest Update</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-sm truncate max-w-[200px]">Enhanced {linkedApp.platform === 'ios' ? 'iOS' : 'Android'} compatibility and bug fixes for better performance.</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs text-muted-foreground hover:text-primary"
                                onClick={() => setShowUpdateDialog(true)}
                              >
                                Show more
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Widgets mockés */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Top 3 Positive Themes
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {mockPositiveThemes.map((t, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{t.theme}</span>
                    <span className="text-sm font-medium text-green-600">+{t.percentage}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <TrendingDown className="h-4 w-4 text-orange-600" />
                    Top 3 Negative Themes
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {mockNegativeThemes.map((t, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{t.theme}</span>
                    <span className="text-sm font-medium text-orange-600">-{t.percentage}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Alert Status
                  </CardTitle>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                    <Plus className="h-3 w-3" />
                    Create New Alert
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {mockAlerts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${a.type === "error" ? "bg-red-500" : "bg-orange-500"
                          }`}
                      />
                      <span className="text-sm text-foreground">{a.message}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button className="w-full mt-4">Create New Alert</Button>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Reviews ({filteredReviews.length})
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
              {loading && (
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
              )}

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

        {/* Update Details Dialog */}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Latest Update Details</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <p className="text-sm leading-relaxed">{app.latestUpdate}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}