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
import { Settings, LogOut, Star, Trash2, ChevronRight } from "lucide-react";
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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {apps.map((app) => (
              <Card key={`${app.platform}#${app.bundleId}`} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* Clickable main content area */}
                  <Link 
                    to={`/revox/apps/${app.platform}/${encodeURIComponent(app.bundleId)}`}
                    className="block p-5 hover:bg-accent/50 transition-colors"
                  >
                    {/* Header section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {app.icon ? (
                          <img
                            src={app.icon}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0" />
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate" title={app.name || app.bundleId}>
                            {app.name || app.bundleId}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs uppercase">
                              {app.platform}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>

                    {/* Stats section */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>
                          {typeof app.rating === "number" ? app.rating.toFixed(1) : "—"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {typeof app.reviewsThisWeek === "number"
                          ? `${app.reviewsThisWeek} reviews`
                          : "No reviews"}
                      </div>
                    </div>
                  </Link>
                  
                  {/* Delete button section */}
                  <div className="px-5 pb-4 pt-0">
                    <Separator className="mb-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground truncate" title={app.bundleId}>
                        {app.bundleId}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteApp(app);
                        }}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        title="Remove app"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}