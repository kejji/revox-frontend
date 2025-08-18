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
import { Sun, Languages, Settings, LogOut, Star } from "lucide-react";
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
            {/* Icône Theme */}
            <Button variant="ghost" size="icon" title="Theme">
              <Sun className="h-5 w-5" />
            </Button>

            {/* Icône Langue */}
            <Button variant="ghost" size="icon" title="Language">
              <Languages className="h-5 w-5" />
            </Button>

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
              <Card key={`${app.platform}#${app.bundleId}`} className="overflow-hidden">
                <CardContent className="p-5">
                  {/* Ligne du haut : icône + titre + badges + bouton View */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {app.icon ? (
                        <img
                          src={app.icon}
                          alt=""
                          className="w-9 h-9 rounded-md object-cover border"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-muted" />
                      )}

                      <div>
                        <div className="font-medium">{app.name || app.bundleId}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="uppercase">
                            {app.platform}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {app.bundleId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      title="Open app details"
                    >
                      <Link
                        to={`/revox/apps/${app.platform}/${encodeURIComponent(app.bundleId)}`}
                      >
                        View
                      </Link>
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  {/* Ligne du bas : note + volume semaine (si dispo) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>
                        {typeof app.rating === "number" ? app.rating.toFixed(1) : "—"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {typeof app.reviewsThisWeek === "number"
                        ? `${app.reviewsThisWeek} reviews this week`
                        : "reviews this week"}
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