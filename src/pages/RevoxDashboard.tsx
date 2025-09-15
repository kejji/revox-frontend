import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, Star, Trash2, ChevronRight, Bot, Apple, MoreVertical, Plus, Link as LinkIcon, Unlink } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Link, useNavigate } from "react-router-dom";

import { api, linkApps, unlinkApps, appPkFromRoute } from "@/api";
import { doSignOut } from "@/lib/auth";

// ✅ Amplify v6: lire l'utilisateur courant + attributs
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

// ---------- Types alignés avec /follow-app ----------
type FollowedApp = {
  bundleId: string;
  platform: "ios" | "android";
  name?: string | null;
  icon?: string | null;
  rating?: number | null;
  reviewsThisWeek?: number | null;
  linked_app_pks?: string[] | null;
  badge_count?: number | null;
};

type MergedApp = {
  id: string; // Unique identifier for the merged app
  name: string;
  icon?: string | null;
  platforms: Array<{
    platform: "ios" | "android";
    bundleId: string;
    rating?: number | null;
    reviewsThisWeek?: number | null;
    badge_count?: number | null;
  }>;
  totalRating?: number;
  totalReviewsThisWeek?: number;
  totalBadgeCount?: number;
  isLinked: boolean;
  appPks: string[];
};

export default function RevoxDashboard() {
  const navigate = useNavigate();

  const [apps, setApps] = useState<FollowedApp[] | null>(null);
  const [mergedApps, setMergedApps] = useState<MergedApp[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 👤 Infos utilisateur connecté (Cognito)
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  // Process apps to create merged view
  const processAppsData = (followedApps: FollowedApp[]): MergedApp[] => {
    const processed: MergedApp[] = [];
    const processedAppPks = new Set<string>();

    followedApps.forEach((app) => {
      const appPk = appPkFromRoute(app.platform, app.bundleId);
      
      if (processedAppPks.has(appPk)) return;

      // Check if this app is linked to another
      const linkedAppPks = app.linked_app_pks || [];
      const linkedApps = followedApps.filter((linkedApp) => {
        const linkedAppPk = appPkFromRoute(linkedApp.platform, linkedApp.bundleId);
        return linkedAppPks.includes(linkedAppPk) && linkedAppPk !== appPk;
      });

      if (linkedApps.length > 0) {
        // Create merged app entry
        const allApps = [app, ...linkedApps];
        const platforms = allApps.map((a) => ({
          platform: a.platform,
          bundleId: a.bundleId,
          rating: a.rating,
          reviewsThisWeek: a.reviewsThisWeek,
          badge_count: a.badge_count,
        }));

        const totalRating = allApps
          .filter((a) => a.rating !== null && a.rating !== undefined)
          .reduce((sum, a, _, arr) => sum + (a.rating || 0) / arr.length, 0);

        const totalReviewsThisWeek = allApps
          .reduce((sum, a) => sum + (a.reviewsThisWeek || 0), 0);

        // Sum badge counts from all linked apps
        const totalBadgeCount = allApps
          .reduce((sum, a) => {
            const badgeCount = typeof a.badge_count === 'number' ? a.badge_count : 0;
            return sum + badgeCount;
          }, 0);

        processed.push({
          id: `merged-${appPk}`,
          name: app.name || app.bundleId,
          icon: app.icon,
          platforms,
          totalRating: totalRating > 0 ? totalRating : undefined,
          totalReviewsThisWeek,
          totalBadgeCount,
          isLinked: true,
          appPks: [appPk, ...linkedAppPks],
        });

        // Mark all related apps as processed
        allApps.forEach((a) => {
          processedAppPks.add(appPkFromRoute(a.platform, a.bundleId));
        });
      } else {
        // Single app entry
        processed.push({
          id: `single-${appPk}`,
          name: app.name || app.bundleId,
          icon: app.icon,
          platforms: [
            {
              platform: app.platform,
              bundleId: app.bundleId,
              rating: app.rating,
              reviewsThisWeek: app.reviewsThisWeek,
              badge_count: app.badge_count,
            },
          ],
          totalRating: app.rating || undefined,
          totalReviewsThisWeek: app.reviewsThisWeek || 0,
          totalBadgeCount: app.badge_count || 0,
          isLinked: false,
          appPks: [appPk],
        });
        processedAppPks.add(appPk);
      }
    });

    return processed;
  };

  // Handle browser back button to navigate to /revox
  useEffect(() => {
    // Push current state to ensure we have a history entry
    window.history.pushState(null, "", window.location.pathname);

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      navigate("/revox", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Récupère l'utilisateur connecté (nom + email)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser(); // { username, userId }
        // Attributs standards Cognito: email, given_name, family_name, ...
        const attrs = await fetchUserAttributes().catch(() => ({} as any));
        const email = (attrs as any)?.email || user.username || "";
        const fullname = [(attrs as any)?.given_name, (attrs as any)?.family_name]
          .filter(Boolean)
          .join(" ")
          .trim();

        if (!mounted) return;
        setUserEmail(email);
        setUserName(fullname || user.username || email || "User");
      } catch {
        // pas connecté ⇒ on laisse vide (ou on pourrait navigate("/revox/auth"))
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Delete app handler
  const handleDeleteApp = async (app: MergedApp, platform?: "ios" | "android") => {
    try {
      if (app.isLinked && platform) {
        // Delete specific platform from linked app
        const platformData = app.platforms.find((p) => p.platform === platform);
        if (platformData) {
          await api.delete("/follow-app", {
            data: {
              platform: platform,
              bundleId: platformData.bundleId,
            },
          });
        }
      } else {
        // Delete all platforms for this app
        for (const platformData of app.platforms) {
          await api.delete("/follow-app", {
            data: {
              platform: platformData.platform,
              bundleId: platformData.bundleId,
            },
          });
        }
      }

      // Refresh the apps list
      await loadApps();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to delete app.");
    }
  };

  // Link apps handler
  const handleLinkApps = async (app1Pk: string, app2Pk: string) => {
    try {
      await linkApps(app1Pk, app2Pk);
      await loadApps();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to link apps.");
    }
  };

  // Unlink apps handler  
  const handleUnlinkApps = async (app1Pk: string, app2Pk: string) => {
    try {
      await unlinkApps(app1Pk, app2Pk);
      await loadApps();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to unlink apps.");
    }
  };

  // Find available apps to link with
  const getAvailableAppsToLink = (currentApp: MergedApp): FollowedApp[] => {
    if (!apps || currentApp.isLinked) return [];
    
    const currentPlatform = currentApp.platforms[0].platform;
    const oppositePlatform = currentPlatform === "ios" ? "android" : "ios";
    
    return apps.filter((app) => 
      app.platform === oppositePlatform && 
      !app.linked_app_pks?.length // Only show unlinked apps
    );
  };

  // Load apps function
  const loadApps = async () => {
    try {
      const { data } = await api.get("/follow-app"); // => { followed: [...] }
      const followedApps = (data?.followed as FollowedApp[]) ?? [];
      setApps(followedApps);
      setMergedApps(processAppsData(followedApps));
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load apps.");
    }
  };

  // Charge la liste des apps suivies
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadApps();
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || e?.message || "Failed to load apps.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Initiales pour l'avatar fallback (ex: "John Doe" => "JD", sinon email => "JD")
  const initials = (() => {
    const source = (userName || userEmail || "").trim();
    if (!source) return "U";
    // si email, prends la partie avant @
    const text = source.includes("@") ? source.split("@")[0] : source;
    const parts = text.split(/[.\s_-]+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase() || first.toUpperCase() || "U";
  })();

  return (
    <Layout showTopbar={false}>
      <section className="p-6 max-w-6xl mx-auto">
        {/* ===== Page header (icônes à droite + avatar) ===== */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Revox Dashboard</h1>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Menu avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {/* Si tu as un avatar URL plus tard, remplace src */}
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
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => doSignOut(navigate)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ===== Sous-header (titre section) ===== */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Your Apps</h2>
        </div>

        {/* ===== Contenu ===== */}
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && err && (
          <div className="border rounded-xl p-6 text-red-600">{err}</div>
        )}

        {!loading && !err && mergedApps && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {mergedApps.map((app) => (
              <Card
                key={app.id}
                className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/50 ${
                  app.isLinked ? 'animate-fade-in' : ''
                }`}
              >
                <CardContent className="p-0">
                  {/* Delete/Options button */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {app.isLinked && (
                          <>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                if (app.appPks.length >= 2) {
                                  handleUnlinkApps(app.appPks[0], app.appPks[1]);
                                }
                              }}
                            >
                              <Unlink className="mr-2 h-4 w-4" />
                              Unlink apps
                            </DropdownMenuItem>
                            {app.platforms.map((platform) => (
                              <DropdownMenuItem
                                key={platform.platform}
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={() => handleDeleteApp(app, platform.platform)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove {platform.platform === 'ios' ? 'iOS' : 'Android'}
                              </DropdownMenuItem>
                            ))}
                          </>
                        )}
                        {!app.isLinked && (
                          <>
                            {getAvailableAppsToLink(app).length > 0 && (
                              <>
                                {getAvailableAppsToLink(app).map((availableApp) => (
                                  <DropdownMenuItem
                                    key={`link-${availableApp.platform}-${availableApp.bundleId}`}
                                    className="cursor-pointer"
                                    onClick={() => {
                                      const currentAppPk = app.appPks[0];
                                      const targetAppPk = appPkFromRoute(availableApp.platform, availableApp.bundleId);
                                      handleLinkApps(currentAppPk, targetAppPk);
                                    }}
                                  >
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    Link with {availableApp.platform === 'ios' ? 'iOS' : 'Android'} {availableApp.name || availableApp.bundleId}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => handleDeleteApp(app)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove app
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Clickable main content area */}
                  <div
                    onClick={() => {
                      // Navigate to first platform
                      const firstPlatform = app.platforms[0];
                      const url = `/revox/apps/${firstPlatform.platform}/${encodeURIComponent(firstPlatform.bundleId)}`;
                      
                      // For merged apps, add all app_pks as URL parameters
                      if (app.isLinked && app.appPks.length > 1) {
                        const params = new URLSearchParams();
                        params.set('app_pks', app.appPks.join(','));
                        navigate(`${url}?${params.toString()}`);
                      } else {
                        navigate(url);
                      }
                    }}
                    className="block p-6 hover:bg-accent/30 transition-colors duration-200 cursor-pointer"
                  >
                    {/* Header section */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        {app.icon ? (
                          <img
                            src={app.icon}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border-2 border-border/50 shadow-sm group-hover:shadow-md transition-shadow duration-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 border-2 border-border/50" />
                        )}
                        {app.isLinked && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <LinkIcon className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-base truncate group-hover:text-primary transition-colors duration-200" title={app.name}>
                          {app.name}
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {app.platforms.map((platform) => (
                            <Badge key={platform.platform} variant="secondary" className="text-xs flex items-center gap-1">
                              {platform.platform === 'ios' ? <Apple className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                              {platform.platform === 'ios' ? 'iOS' : 'Android'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats section */}
                    <div className="flex items-center justify-between">
                      {app.platforms.length > 1 ? (
                        <div className="flex items-center gap-2">
                          {app.platforms.map((platform) => (
                            <div key={platform.platform} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                              {platform.platform === 'ios' ? <Apple className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium text-sm">
                                {typeof platform.rating === "number" ? platform.rating.toFixed(1) : "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                          {app.platforms[0]?.platform === 'ios' ? <Apple className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium text-sm">
                            {typeof app.totalRating === "number" ? app.totalRating.toFixed(1) : "—"}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {(app.totalBadgeCount || 0) > 0 && (
                          <Badge variant="destructive" className="text-xs h-5 px-1.5">
                            {app.totalBadgeCount}
                          </Badge>
                        )}
                        <div className="text-xs text-muted-foreground font-medium">
                          {(app.totalBadgeCount || 0) > 0
                            ? "new reviews"
                            : "No recent reviews"}
                        </div>
                      </div>
                    </div>

                    {/* Call to action hint */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>View detailed analytics</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Click to explore →
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New App Card */}
            <Card className="group relative overflow-hidden border border-border hover:border-border/80 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-0">
                <Link
                  to="/revox/add"
                  className="flex flex-col items-center justify-center p-8 h-full min-h-[200px] transition-all duration-200 cursor-pointer text-center"
                >
                  {/* Simple plus icon */}
                  <div className="w-12 h-12 flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-base">
                      Add New App
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[180px]">
                      Connect your app to start monitoring feedback
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </Layout>
  );
}