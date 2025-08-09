import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Star, 
  Calendar,
  Smartphone,
  Apple,
  Bot,
  Search,
  FileText,
  Plus,
  Bell,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  SlidersHorizontal,
  BarChart3,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  date: string;
  platform: 'ios' | 'android';
  helpful: number;
}

interface App {
  id: string;
  name: string;
  description: string;
  version: string;
  latestUpdate: string;
  platforms: ('ios' | 'android')[];
  currentRating: number;
  totalReviews: number;
}

const RevoxAppDetails = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  
  // Mock app data - will be replaced with actual data fetching
  const [app] = useState<App>({
    id: appId || '1',
    name: 'TaskFlow Pro',
    description: 'A comprehensive task management app that helps teams collaborate efficiently and track project progress in real-time.',
    version: '2.3.1',
    latestUpdate: 'Fixed critical bug with notification sync and improved performance on iOS 17.',
    platforms: ['ios', 'android'],
    currentRating: 4.2,
    totalReviews: 1847
  });

  // Mock reviews data
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      rating: 5,
      title: 'Amazing productivity boost!',
      content: 'This app has completely transformed how our team manages projects. The interface is intuitive and the collaboration features are top-notch.',
      author: 'Sarah M.',
      date: '2024-01-15T14:30:00',
      platform: 'ios',
      helpful: 12
    },
    {
      id: '2',
      rating: 4,
      title: 'Great app, minor issues',
      content: 'Love the features but occasionally crashes when syncing large files. Support team is responsive though.',
      author: 'Mike D.',
      date: '2024-01-14T09:15:00',
      platform: 'android',
      helpful: 8
    },
    {
      id: '3',
      rating: 2,
      title: 'Needs improvement',
      content: 'The latest update broke several features I relied on daily. Please fix the notification system.',
      author: 'Jennifer L.',
      date: '2024-01-13T16:45:00',
      platform: 'ios',
      helpful: 15
    }
  ]);

  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [topThemesPlatform, setTopThemesPlatform] = useState<string>('all');
  const [flopThemesPlatform, setFlopThemesPlatform] = useState<string>('all');
  const [chartPlatformFilter, setChartPlatformFilter] = useState<string>('all');
  
  const reviewsPerPage = 10;

  // Mock individual review data for scatter chart
  const reviewsChartData = [
    { date: '2024-01-10', rating: 5, platform: 'ios', timestamp: new Date('2024-01-10T08:30:00').getTime() },
    { date: '2024-01-10', rating: 4, platform: 'android', timestamp: new Date('2024-01-10T10:15:00').getTime() },
    { date: '2024-01-10', rating: 3, platform: 'ios', timestamp: new Date('2024-01-10T14:20:00').getTime() },
    { date: '2024-01-11', rating: 2, platform: 'android', timestamp: new Date('2024-01-11T09:45:00').getTime() },
    { date: '2024-01-11', rating: 5, platform: 'ios', timestamp: new Date('2024-01-11T11:30:00').getTime() },
    { date: '2024-01-11', rating: 4, platform: 'ios', timestamp: new Date('2024-01-11T16:00:00').getTime() },
    { date: '2024-01-12', rating: 5, platform: 'android', timestamp: new Date('2024-01-12T12:15:00').getTime() },
    { date: '2024-01-12', rating: 3, platform: 'ios', timestamp: new Date('2024-01-12T13:45:00').getTime() },
    { date: '2024-01-12', rating: 4, platform: 'android', timestamp: new Date('2024-01-12T17:30:00').getTime() },
    { date: '2024-01-13', rating: 1, platform: 'ios', timestamp: new Date('2024-01-13T07:20:00').getTime() },
    { date: '2024-01-13', rating: 2, platform: 'android', timestamp: new Date('2024-01-13T15:10:00').getTime() },
    { date: '2024-01-14', rating: 4, platform: 'ios', timestamp: new Date('2024-01-14T09:15:00').getTime() },
    { date: '2024-01-14', rating: 5, platform: 'android', timestamp: new Date('2024-01-14T14:30:00').getTime() },
    { date: '2024-01-15', rating: 5, platform: 'ios', timestamp: new Date('2024-01-15T11:45:00').getTime() },
    { date: '2024-01-15', rating: 3, platform: 'android', timestamp: new Date('2024-01-15T16:20:00').getTime() },
    { date: '2024-01-16', rating: 4, platform: 'ios', timestamp: new Date('2024-01-16T10:30:00').getTime() },
    { date: '2024-01-16', rating: 5, platform: 'android', timestamp: new Date('2024-01-16T13:15:00').getTime() }
  ];

  // Filter chart data based on platform
  const getFilteredChartData = () => {
    if (chartPlatformFilter === 'all') return reviewsChartData;
    return reviewsChartData.filter(review => review.platform === chartPlatformFilter);
  };

  useEffect(() => {
    let filtered = [...reviews];
    
    if (platformFilter !== 'all') {
      filtered = filtered.filter(review => review.platform === platformFilter);
    }
    
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }
    
    if (searchKeyword) {
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        review.content.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    
    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [platformFilter, ratingFilter, searchKeyword, reviews]);

  const getCurrentPageReviews = () => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    return filteredReviews.slice(startIndex, startIndex + reviewsPerPage);
  };

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
      />
    ));
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // Export functionality to be implemented
    console.log(`Exporting reviews as ${format}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/revox/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold">{app.name}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Alert Management Widget */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Bell className="w-4 h-4" />
                  Alerts (2)
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Theme Alerts</h4>
                    <Button size="sm" className="gap-1">
                      <Plus className="w-3 h-3" />
                      New Alert
                    </Button>
                  </div>
                  
                  {/* Active Alerts */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex-1">
                        <div className="text-sm font-medium">Crash mentions</div>
                        <div className="text-xs text-muted-foreground">Threshold: {'>'}5 mentions/day</div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex-1">
                        <div className="text-sm font-medium">Low ratings spike</div>
                        <div className="text-xs text-muted-foreground">Threshold: {'>'}10 1-star reviews/day</div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground border-t pt-2">
                    Get notified when specific themes spike in reviews
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* App Info Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center">
                <Smartphone className="w-10 h-10" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{app.name}</h1>
                    <div className="flex gap-1">
                      {app.platforms.map(platform => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform === 'ios' ? (
                            <Apple className="w-3 h-3 mr-1" />
                          ) : (
                            <Bot className="w-3 h-3 mr-1" />
                          )}
                          {platform.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{app.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Version:</span> {app.version}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Rating:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(Math.round(app.currentRating))}
                        <span>{app.currentRating}</span>
                        <span className="text-muted-foreground">({app.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Latest Update:</span>
                      <p className="text-muted-foreground mt-1">{app.latestUpdate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics and Trends Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Analytics Widgets */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Top 3 Positive Themes
                  </CardTitle>
                  <Select value={topThemesPlatform} onValueChange={setTopThemesPlatform}>
                    <SelectTrigger className="w-full sm:w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="w-3 h-3" />
                          All
                        </div>
                      </SelectItem>
                      <SelectItem value="ios">
                        <div className="flex items-center gap-2">
                          <Apple className="w-3 h-3" />
                          iOS
                        </div>
                      </SelectItem>
                      <SelectItem value="android">
                        <div className="flex items-center gap-2">
                          <Bot className="w-3 h-3" />
                          Android
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>User Interface</span>
                    <span className="text-green-500">+89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance</span>
                    <span className="text-green-500">+76%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Features</span>
                    <span className="text-green-500">+64%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    Top 3 Negative Themes
                  </CardTitle>
                  <Select value={flopThemesPlatform} onValueChange={setFlopThemesPlatform}>
                    <SelectTrigger className="w-full sm:w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="w-3 h-3" />
                          All
                        </div>
                      </SelectItem>
                      <SelectItem value="ios">
                        <div className="flex items-center gap-2">
                          <Apple className="w-3 h-3" />
                          iOS
                        </div>
                      </SelectItem>
                      <SelectItem value="android">
                        <div className="flex items-center gap-2">
                          <Bot className="w-3 h-3" />
                          Android
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Crashes</span>
                    <span className="text-red-500">-34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sync Issues</span>
                    <span className="text-red-500">-28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery Drain</span>
                    <span className="text-red-500">-19%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Distribution Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    Reviews Distribution
                  </CardTitle>
                  <Select value={chartPlatformFilter} onValueChange={setChartPlatformFilter}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="w-3 h-3" />
                          All
                        </div>
                      </SelectItem>
                      <SelectItem value="ios">
                        <div className="flex items-center gap-2">
                          <Apple className="w-3 h-3" />
                          iOS
                        </div>
                      </SelectItem>
                      <SelectItem value="android">
                        <div className="flex items-center gap-2">
                          <Bot className="w-3 h-3" />
                          Android
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={getFilteredChartData()}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs"
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        domain={[0.5, 5.5]}
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        tickCount={5}
                        ticks={[1, 2, 3, 4, 5]}
                      />
                      <Scatter name="iOS Reviews" dataKey="rating" fill="#007AFF">
                        {getFilteredChartData().map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.platform === 'ios' ? '#007AFF' : '#34C759'} 
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Individual review ratings over time</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#007AFF]"></div>
                      <span>iOS</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#34C759]"></div>
                      <span>Android</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Reviews ({filteredReviews.length})
            </CardTitle>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {getCurrentPageReviews().map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{review.author}</span>
                            <Badge variant="outline" className="text-xs">
                              {review.platform === 'ios' ? (
                                <Apple className="w-3 h-3 mr-1" />
                              ) : (
                                <Bot className="w-3 h-3 mr-1" />
                              )}
                              {review.platform.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-xs text-muted-foreground">{format(new Date(review.date), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{review.content}</p>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * reviewsPerPage + 1} to {Math.min(currentPage * reviewsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default RevoxAppDetails;