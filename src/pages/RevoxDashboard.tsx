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
import { Settings, LogOut, Star, Trash2, ChevronRight, Bot, Apple, MoreVertical } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Link, useNavigate } from "react-router-dom";

import { api } from "@/api";
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
};

export default function RevoxDashboard() {
  const navigate = useNavigate();

  const [apps, setApps] = useState<FollowedApp[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 👤 Infos utilisateur connecté (Cognito)
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

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
        const fullname = [ (attrs as any)?.given_name, (attrs as any)?.family_name ]
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
  const handleDeleteApp = async (app: FollowedApp) => {
    try {
      await api.delete(`/follow-app/${app.platform}/${encodeURIComponent(app.bundleId)}`);
      setApps(prev => prev ? prev.filter(a => !(a.platform === app.platform && a.bundleId === app.bundleId)) : null);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to delete app.");
    }
  };

  // Charge la liste des apps suivies
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/follow-app"); // => { followed: [...] }
        if (!mounted) return;
        setApps((data?.followed as FollowedApp[]) ?? []);
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

        {/* ===== Sous-header (titre section + bouton Add) ===== */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Your Apps</h2>
            <p className="text-sm text-muted-foreground">
              Monitor feedback from {apps ? apps.length : 0} apps
            </p>
          </div>
          <Button asChild>
            <Link to="/revox/add">+ Add New App</Link>
          </Button>
        </div>

        {/* ===== Contenu ===== */}
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && err && (
          <div className="border rounded-xl p-6 text-red-600">{err}</div>
        )}

        {!loading && !err && apps && apps.length === 0 && (
          <div className="border rounded-xl p-8 text-center">
            <p className="mb-3">You don’t follow any app yet.</p>
            <Button asChild>
              <Link to="/revox/add">+ Add your first app</Link>
            </Button>
          </div>
        )}

        {!loading && !err && apps && apps.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {apps.map((app) => (
              <Card 
                key={`${app.platform}#${app.bundleId}`} 
                className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/50"
              >
                <CardContent className="p-0">
                  {/* Delete button - positioned absolutely */}
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
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleDeleteApp(app)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove app
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Clickable main content area */}
                  <Link 
                    to={`/revox/apps/${app.platform}/${encodeURIComponent(app.bundleId)}`}
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
                        
                        {/* Platform badge overlay */}
                        <div className="absolute -bottom-1 -right-1 bg-background border-2 border-background rounded-full p-1">
                          {app.platform === 'ios' ? 
                            <Apple className="h-3 w-3 text-foreground" /> : 
                            <Bot className="h-3 w-3 text-foreground" />
                          }
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-base truncate group-hover:text-primary transition-colors duration-200" title={app.name || app.bundleId}>
                          {app.name || app.bundleId}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 capitalize">
                          {app.platform} App
                        </div>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                    </div>

                    {/* Stats section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-sm">
                          {typeof app.rating === "number" ? app.rating.toFixed(1) : "—"}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground font-medium">
                        {typeof app.reviewsThisWeek === "number"
                          ? `${app.reviewsThisWeek} reviews this week`
                          : "No recent reviews"}
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
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}