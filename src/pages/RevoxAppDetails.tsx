import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Search,
  Download,
  RefreshCw,
  MoreVertical,
  X,
  Plus,
  Apple,
  Bot,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";

// Mock data - replace with real API calls
const mockApp = {
  id: "taskflow-pro",
  name: "TaskFlow Pro",
  description: "A comprehensive task management app that helps teams collaborate efficiently and track project progress in real-time.",
  version: "2.3.1",
  rating: 4.2,
  totalReviews: 1847,
  latestUpdate: "Fixed critical bug with notification sync and improved performance on iOS 17.",
  platforms: ["ios", "android"] as const,
  icon: null,
};

const mockPositiveThemes = [
  { theme: "User Interface", percentage: 89, trend: "up" },
  { theme: "Performance", percentage: 76, trend: "up" },
  { theme: "Features", percentage: 64, trend: "up" },
];

const mockNegativeThemes = [
  { theme: "Crashes", percentage: 34, trend: "down" },
  { theme: "Sync Issues", percentage: 28, trend: "down" },
  { theme: "Battery Drain", percentage: 19, trend: "down" },
];

const mockAlerts = [
  {
    id: 1,
    type: "warning",
    message: "Rating drops below 4.0",
    active: true,
  },
  {
    id: 2,
    type: "error", 
    message: "Crash mentions spike",
    active: true,
  },
];

const mockRatingData = [
  { date: "2024-01-15", rating: 4.0 },
  { date: "2024-02-15", rating: 3.8 },
  { date: "2024-03-15", rating: 4.1 },
  { date: "2024-04-15", rating: 1.8 },
  { date: "2024-05-15", rating: 4.5 },
  { date: "2024-06-15", rating: 4.3 },
  { date: "2024-07-15", rating: 4.7 },
];

const mockReviews = [
  {
    id: 1,
    author: "Sarah M.",
    platform: "ios",
    rating: 5,
    date: "Jan 15, 2024 14:30",
    title: "Amazing productivity boost!",
    content: "This app has completely transformed how our team manages projects. The interface is intuitive and the collaboration features are top-notch.",
    helpful: 12,
  },
  {
    id: 2,
    author: "Mike D.",
    platform: "android",
    rating: 4,
    date: "Jan 14, 2024 09:15",
    title: "Great app, minor issues",
    content: "Love the features but occasionally crashes when syncing large files. Support team is responsive though.",
    helpful: 8,
  },
  {
    id: 3,
    author: "Jennifer L.",
    platform: "ios",
    rating: 2,
    date: "Jan 13, 2024 16:45",
    title: "Needs improvement",
    content: "Good concept but the app is buggy and drains battery quickly. Hope they fix these issues soon.",
    helpful: 3,
  },
];

const chartConfig = {
  rating: {
    label: "Average Rating",
    color: "hsl(var(--chart-1))",
  },
};

export default function RevoxAppDetails() {
  const { platform, bundleId } = useParams<{ platform: string; bundleId: string }>();
  const navigate = useNavigate();
  
  const [app, setApp] = useState(mockApp);
  const [reviews, setReviews] = useState(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [chartPlatformFilter, setChartPlatformFilter] = useState("all");

  // Filter reviews based on search and filters
  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(
        review =>
          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (platformFilter !== "all") {
      filtered = filtered.filter(review => review.platform === platformFilter);
    }

    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, platformFilter, ratingFilter]);

  const handleRefresh = () => {
    // Mock refresh - in real app, refetch data
    console.log("Refreshing data...");
  };

  const handleExport = () => {
    // Mock export functionality
    console.log("Exporting reviews...");
  };

  const handleCreateAlert = () => {
    // Mock create alert functionality
    console.log("Creating new alert...");
  };

  const handleRemoveAlert = (alertId: number) => {
    // Mock remove alert functionality
    console.log("Removing alert:", alertId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
        }`}
      />
    ));
  };

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
          {/* App Info Card */}
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
                        {app.platforms.includes("ios") && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Apple className="h-3 w-3" />
                            iOS
                          </Badge>
                        )}
                        {app.platforms.includes("android") && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Bot className="h-3 w-3" />
                            Android
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{app.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Version</h3>
                      <p className="font-medium">{app.version}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Rating</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(Math.floor(app.rating))}</div>
                        <span className="font-medium">{app.rating}</span>
                        <span className="text-sm text-muted-foreground">({app.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Latest Update</h3>
                      <p className="text-sm">{app.latestUpdate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Positive Themes */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Top 3 Positive Themes
                  </CardTitle>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-16 h-7 text-xs border-0 bg-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="ios">iOS</SelectItem>
                      <SelectItem value="android">Android</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {mockPositiveThemes.map((theme, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{theme.theme}</span>
                      <span className="text-sm font-medium text-green-600">+{theme.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Negative Themes */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <TrendingDown className="h-4 w-4 text-orange-600" />
                    Top 3 Negative Themes
                  </CardTitle>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-16 h-7 text-xs border-0 bg-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="ios">iOS</SelectItem>
                      <SelectItem value="android">Android</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {mockNegativeThemes.map((theme, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{theme.theme}</span>
                      <span className="text-sm font-medium text-orange-600">-{theme.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alert Status */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Alert Status
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={handleCreateAlert} className="h-7 text-xs gap-1">
                    <Plus className="h-3 w-3" />
                    Create New Alert
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          alert.type === 'error' ? 'bg-red-500' : 'bg-orange-500'
                        }`} />
                        <span className="text-sm text-foreground">{alert.message}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAlert(alert.id)}
                        className="h-6 w-6 p-0 hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90" 
                  onClick={handleCreateAlert}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Alert
                </Button>
              </CardContent>
            </Card>
          </div>



          {/* Reviews Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Reviews ({filteredReviews.length})</CardTitle>
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
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="ios">iOS</SelectItem>
                    <SelectItem value="android">Android</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
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

              {/* Reviews List */}
              <ScrollArea className="h-96">
                <div className="space-y-4 pr-4">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium text-sm">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{review.author}</span>
                              <Badge variant="secondary" className="flex items-center gap-1 h-5 text-xs">
                                {review.platform === 'ios' ? (
                                  <Apple className="h-3 w-3" />
                                ) : (
                                  <Bot className="h-3 w-3" />
                                )}
                                {review.platform === 'ios' ? 'iOS' : 'Android'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {review.date}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {review.rating}/5
                        </span>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}