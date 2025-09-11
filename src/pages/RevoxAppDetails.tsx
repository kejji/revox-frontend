// src/pages/RevoxAppDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { api, appPkFromRoute, getReviewsExportUrl } from "@/api";

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

  // Header app (mock)
  const [app] = useState(mockApp);

  // Reviews + pagination
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Filtres UI (client)
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "ios" | "android">("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | "1" | "2" | "3" | "4" | "5">("all");

  // --- Chargement initial (reset) ---
  async function fetchReviewsInitial() {
    if (!platform || !bundleId) return;
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get<ReviewsResponse>("/reviews", {
        params: {
          app_pk: appPkFromRoute(platform, bundleId),
          limit: LIMIT,
          order: "desc",
        },
      });
      const rows = (data?.items ?? []) as ReviewItem[];
      setReviews(rows);
      const next = data?.nextCursor || undefined;
      setCursor(next);
      setHasMore(!!next);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to load reviews.");
      setReviews([]);
      setCursor(undefined);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  // --- Pages suivantes ---
  async function fetchReviewsMore() {
    if (!platform || !bundleId) return;
    if (!hasMore || !cursor || loadingMore) return;

    setLoadingMore(true);
    try {
      const { data } = await api.get<ReviewsResponse>("/reviews", {
        params: {
          app_pk: appPkFromRoute(platform, bundleId),
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
    fetchReviewsInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, bundleId]);

  // Ingest (refresh) → POST puis reset
  const handleRefresh = async () => {
    if (!platform || !bundleId) return;
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
    }
  };

  // Export CSV → GET blob + download
  const handleExport = async () => {
    if (!platform || !bundleId) return;
    try {
      const urlPath = getReviewsExportUrl({
        app_pk: appPkFromRoute(platform, bundleId),
        order: "desc",
      });
      const resp = await api.get(urlPath, { responseType: "blob" });
      const blob = new Blob([resp.data], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const fileBase = `${platform}_${bundleId}`;
      a.href = url;
      a.download = `${fileBase}_reviews.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to export reviews.");
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

  function formatDate(dateString: string) {
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} . ${hours}:${minutes}`;
  }

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
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{app.name}</h2>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {platform === "ios" ? <Apple className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                          {platform?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{app.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        Version
                      </h3>
                      <p className="font-medium">{app.version}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        Rating
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(Math.floor(app.rating))}</div>
                        <span className="font-medium">{app.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({app.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        Latest Update
                      </h3>
                      <p className="text-sm">{app.latestUpdate}</p>
                    </div>
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
              {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
              {!loading && err && (
                <div className="text-sm text-red-600 border p-3 rounded">{err}</div>
              )}
              {!loading && !err && (
                <>
                  <ScrollArea className="h-96">
                    <div className="space-y-4 pr-4">
                      {filteredReviews.map((r, idx) => (
                        <div key={`${r.date}-${idx}`} className="border rounded-lg p-4 space-y-3">
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
                              {formatDate(r.date)}
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}