import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Smartphone,
  Apple,
  Bot,
  Star,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Plus,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { searchApps, type SearchAppItem } from "@/api";

// Types for app search results
type SearchedApp = {
  name: string;
  icon?: string;
  rating?: number;
  platforms: ("ios" | "android")[];
  description?: string;
  bundleIds: { platform: "ios" | "android"; bundleId: string }[];
};

// Types for follow selections
type FollowSelection = {
  name: string;
  platforms: ("ios" | "android")[];
  bundleIds: { platform: "ios" | "android"; bundleId: string }[];
};

export default function RevoxAddApp() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedApp[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [followSelections, setFollowSelections] = useState<Map<string, FollowSelection>>(new Map());
  const [isFollowing, setIsFollowing] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      await performSearch(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    if (!query) return;

    setIsSearching(true);
    try {
      // ✅ appelle GET /search-app?query=...
      const flat: SearchAppItem[] = await searchApps(query.trim());

      // ✅ groupage par nom pour produire ton modèle SearchedApp
      const byName = new Map<string, SearchedApp>();

      for (const item of flat) {
        const platform = item.store === "ios" ? "ios" : "android";

        if (!byName.has(item.name)) {
          byName.set(item.name, {
            name: item.name,
            icon: item.icon,
            platforms: [platform],
            bundleIds: [{ platform, bundleId: item.bundleId }],
          });
        } else {
          const existing = byName.get(item.name)!;
          // Mets à jour le nom/icon si l’élément existant n’en a pas
          
          if (!existing.icon && item.icon) existing.icon = item.icon;
          if (!existing.platforms.includes(platform)) {
            existing.platforms.push(platform);
          }
          // Ajoute le bundleId pour cette plateforme s'il n'existe pas déjà
          if (!existing.bundleIds.some(b => b.platform === platform && b.bundleId === item.bundleId)) {
            existing.bundleIds.push({ platform, bundleId: item.bundleId });
          }
        }
      }

      setSearchResults(Array.from(byName.values()));
      setHasSearched(true);
      // Optionnel: reset les sélections si on lance une nouvelle recherche
      setFollowSelections(new Map());
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error?.response?.data?.message || "Failed to search apps",
        variant: "destructive",
      });
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlatformSelection = (appName: string, platform: "ios" | "android", checked: boolean, appBundleIds: { platform: "ios" | "android"; bundleId: string }[]) => {
    const current = followSelections.get(appName) || { name: appName, platforms: [], bundleIds: appBundleIds };

    if (checked) {
      // Add platform if not already included
      if (!current.platforms.includes(platform)) {
        current.platforms.push(platform);
      }
    } else {
      // Remove platform
      current.platforms = current.platforms.filter(p => p !== platform);
    }

    const newSelections = new Map(followSelections);
    if (current.platforms.length > 0) {
      newSelections.set(appName, current);
    } else {
      newSelections.delete(appName);
    }

    setFollowSelections(newSelections);
  };

const handleFollowApps = async () => {
  if (followSelections.size === 0) return;

  setIsFollowing(true);
  try {
    // 1) Aplatis les sélections en une liste de { platform, bundleId }
    const payloads = Array.from(followSelections.values()).flatMap((selection) =>
      selection.platforms.map((platform) => {
        const bundleInfo = selection.bundleIds.find(b => b.platform === platform);
        return {
          bundleId: bundleInfo?.bundleId || '',
          platform, // "ios" | "android"
        };
      }).filter(p => p.bundleId) // Filter out empty bundleIds
    );

    // 2) Envoi un POST par app sélectionnée
    const results = await Promise.allSettled(
      payloads.map((p) => api.post("/follow-app", p))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - succeeded;

    if (failed === 0) {
      toast({
        title: "Success!",
        description: `Following ${succeeded} app${succeeded > 1 ? "s" : ""}.`,
      });
      // Retour au dashboard
      navigate("/revox/dashboard");
    } else if (succeeded > 0) {
      toast({
        title: "Partial success",
        description: `Followed ${succeeded} app${succeeded > 1 ? "s" : ""}, ${failed} failed.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Failed to follow apps",
        description: "No app could be followed. Please try again.",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    toast({
      title: "Failed to follow apps",
      description: error?.response?.data?.message || "An error occurred",
      variant: "destructive",
    });
  } finally {
    setIsFollowing(false);
  }
};

  const selectedCount = Array.from(followSelections.values()).reduce(
    (total, selection) => total + selection.platforms.length,
    0
  );

  return (
    <Layout showTopbar={false}>
      <section className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/revox/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Add New App</h1>
            <p className="text-sm text-muted-foreground">
              Search and follow apps from the App Store and Google Play
            </p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for apps by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            {isSearching && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Searching app stores...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                Search Results ({searchResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No apps found for "{searchQuery}"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try a different search term or check your spelling
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((app) => {
                    const selection = followSelections.get(app.name);
                    const isIosSelected = selection?.platforms.includes("ios") || false;
                    const isAndroidSelected = selection?.platforms.includes("android") || false;

                    return (
                      <div key={app.name} className="border rounded-lg p-4">
                        {/* App Info */}
                        <div className="flex items-start gap-3 mb-3">
                          {app.icon ? (
                            <img
                              src={app.icon}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover border"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                              <Smartphone className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm">{app.name}</h3>

                            {app.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {app.description}
                              </p>
                            )}

                            <div className="flex items-center gap-3">
                              {app.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs">{app.rating.toFixed(1)}</span>
                                </div>
                              )}

                              <div className="flex gap-1">
                                {app.platforms.map((platform) => (
                                  <Badge key={platform} variant="secondary" className="text-xs flex items-center gap-1">
                                    {platform === "ios" ? (
                                      <Apple className="h-3 w-3" />
                                    ) : (
                                      <Bot className="h-3 w-3" />
                                    )}
                                    {platform === "ios" ? "iOS" : "Android"}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator className="mb-3" />

                        {/* Platform Selection */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Follow on:</p>
                          <div className="flex flex-wrap gap-3">
                            {app.platforms.map((platform) => (
                              <div key={platform} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${app.name}-${platform}`}
                                  checked={platform === "ios" ? isIosSelected : isAndroidSelected}
                                  onCheckedChange={(checked) =>
                                    handlePlatformSelection(app.name, platform, checked as boolean, app.bundleIds)
                                  }
                                />
                                <label
                                  htmlFor={`${app.name}-${platform}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                                >
                                  {platform === "ios" ? (
                                    <Apple className="h-4 w-4" />
                                  ) : (
                                    <Bot className="h-4 w-4" />
                                  )}
                                  {platform === "ios" ? "iOS" : "Android"}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Follow Button */}
        {selectedCount > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {selectedCount} app{selectedCount > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ready to start monitoring feedback
                  </p>
                </div>
                <Button
                  onClick={handleFollowApps}
                  disabled={isFollowing}
                  className="gap-2"
                >
                  {isFollowing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Follow App{selectedCount > 1 ? 's' : ''}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Text */}
        {!hasSearched && searchQuery.length === 0 && (
          <Alert>
            <AlertDescription>
              Search for apps by name to find them on both the App Store and Google Play.
              You can follow apps on one or both platforms depending on your needs.
            </AlertDescription>
          </Alert>
        )}

        {hasSearched && searchResults.length === 0 && searchQuery.length > 0 && (
          <Alert>
            <AlertDescription>
              No apps found for "{searchQuery}". Try searching with different keywords or check the spelling.
            </AlertDescription>
          </Alert>
        )}
      </section>
    </Layout>
  );
}