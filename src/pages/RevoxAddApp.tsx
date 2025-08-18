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
  Star, 
  ArrowLeft, 
  Loader2,
  CheckCircle,
  Plus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useToast } from "@/hooks/use-toast";

// Types for app search results
type SearchedApp = {
  bundleId: string;
  name: string;
  icon?: string;
  rating?: number;
  platforms: ("ios" | "android")[];
  description?: string;
};

// Types for follow selections
type FollowSelection = {
  bundleId: string;
  platforms: ("ios" | "android")[];
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
      const { data } = await api.get(`/search-apps?q=${encodeURIComponent(query)}`);
      setSearchResults(data.results || []);
      setHasSearched(true);
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

  const handlePlatformSelection = (bundleId: string, platform: "ios" | "android", checked: boolean) => {
    const current = followSelections.get(bundleId) || { bundleId, platforms: [] };
    
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
      newSelections.set(bundleId, current);
    } else {
      newSelections.delete(bundleId);
    }
    
    setFollowSelections(newSelections);
  };

  const handleFollowApps = async () => {
    if (followSelections.size === 0) return;

    setIsFollowing(true);
    try {
      // Convert selections to API format
      const appsToFollow = Array.from(followSelections.values()).flatMap(selection =>
        selection.platforms.map(platform => ({
          bundleId: selection.bundleId,
          platform
        }))
      );

      await api.post("/follow-app", { apps: appsToFollow });
      
      toast({
        title: "Success!",
        description: `Following ${appsToFollow.length} app${appsToFollow.length > 1 ? 's' : ''}`,
      });
      
      navigate("/revox/dashboard");
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
              <Input
                placeholder="Enter app name to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
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
                    const selection = followSelections.get(app.bundleId);
                    const isIosSelected = selection?.platforms.includes("ios") || false;
                    const isAndroidSelected = selection?.platforms.includes("android") || false;
                    
                    return (
                      <div key={app.bundleId} className="border rounded-lg p-4">
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
                            <p className="text-xs text-muted-foreground mb-2">{app.bundleId}</p>
                            
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
                                  <Badge key={platform} variant="secondary" className="text-xs">
                                    {platform === "ios" ? (
                                      <Apple className="h-3 w-3 mr-1" />
                                    ) : (
                                      <Smartphone className="h-3 w-3 mr-1" />
                                    )}
                                    {platform.toUpperCase()}
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
                                  id={`${app.bundleId}-${platform}`}
                                  checked={platform === "ios" ? isIosSelected : isAndroidSelected}
                                  onCheckedChange={(checked) => 
                                    handlePlatformSelection(app.bundleId, platform, checked as boolean)
                                  }
                                />
                                <label
                                  htmlFor={`${app.bundleId}-${platform}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 cursor-pointer"
                                >
                                  {platform === "ios" ? (
                                    <Apple className="h-4 w-4" />
                                  ) : (
                                    <Smartphone className="h-4 w-4" />
                                  )}
                                  {platform === "ios" ? "App Store" : "Google Play"}
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
        {!hasSearched && (
          <Alert>
            <AlertDescription>
              Search for apps by name to find them on both the App Store and Google Play. 
              You can follow apps on one or both platforms depending on your needs.
            </AlertDescription>
          </Alert>
        )}
      </section>
    </Layout>
  );
}