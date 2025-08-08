import { useState } from "react";
import { 
  Plus, 
  MoreVertical, 
  Settings, 
  LogOut, 
  Star, 
  TrendingUp, 
  MessageSquare, 
  AlertTriangle,
  Smartphone,
  Zap,
  Apple,
  Trash2,
  Grid3X3,
  BarChart3,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";

interface App {
  id: string;
  name: string;
  icon: string;
  platforms: ('ios' | 'android')[];
  currentRating: number;
  weeklyReviews: number;
  trend: 'up' | 'down' | 'stable';
}

interface Widget {
  id: string;
  title: string;
  type: 'rating-evolution' | 'recent-reviews' | 'alerts' | 'rating-comparison';
  data?: any;
}

const RevoxDashboard = () => {
  const [apps, setApps] = useState<App[]>([
    {
      id: '1',
      name: 'TaskFlow Pro',
      icon: '/placeholder.svg',
      platforms: ['ios', 'android'],
      currentRating: 4.2,
      weeklyReviews: 187,
      trend: 'up'
    },
    {
      id: '2', 
      name: 'FitTracker',
      icon: '/placeholder.svg',
      platforms: ['ios'],
      currentRating: 3.8,
      weeklyReviews: 94,
      trend: 'down'
    },
    {
      id: '3',
      name: 'ShopSmart',
      icon: '/placeholder.svg', 
      platforms: ['android'],
      currentRating: 4.6,
      weeklyReviews: 312,
      trend: 'up'
    }
  ]);

  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', title: 'Rating Evolution', type: 'rating-evolution' },
    { id: '2', title: 'Recent Reviews', type: 'recent-reviews' },
    { id: '3', title: 'Critical Alerts', type: 'alerts' },
    { id: '4', title: 'App Comparison', type: 'rating-comparison' }
  ]);

  const removeApp = (appId: string) => {
    setApps(apps.filter(app => app.id !== appId));
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
  };

  const renderPlatformBadges = (platforms: string[]) => (
    <div className="flex gap-1">
      {platforms.map(platform => (
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
  );

  const renderWidget = (widget: Widget) => {
    const icons = {
      'rating-evolution': BarChart3,
      'recent-reviews': MessageSquare,
      'alerts': AlertTriangle,
      'rating-comparison': TrendingUp
    };
    
    const Icon = icons[widget.type];

    return (
      <Card key={widget.id} className="relative group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {widget.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Configure</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => removeWidget(widget.id)}
                className="text-destructive"
              >
                Remove Widget
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm">
            {widget.type === 'rating-evolution' && 'Rating trends over time'}
            {widget.type === 'recent-reviews' && '15 new reviews today'}
            {widget.type === 'alerts' && '2 negative spikes detected'}
            {widget.type === 'rating-comparison' && 'TaskFlow Pro leading at 4.2★'}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Revox Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">John Doe</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      john.doe@company.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* App List Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Your Apps</h2>
              <p className="text-muted-foreground">
                Monitor feedback from {apps.length} app{apps.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add New App
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <Card key={app.id} className="relative group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{app.name}</CardTitle>
                      {renderPlatformBadges(app.platforms)}
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove App
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {app.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently remove
                          the app from your dashboard and delete all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => removeApp(app.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span className="font-medium">{app.currentRating}</span>
                      <TrendingUp className={`w-4 h-4 ${
                        app.trend === 'up' ? 'text-green-500' : 
                        app.trend === 'down' ? 'text-red-500 rotate-180' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{app.weeklyReviews}</p>
                      <p className="text-xs text-muted-foreground">reviews this week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Widgets Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Analytics Dashboard</h2>
              <p className="text-muted-foreground">
                Monitor your app performance with customizable widgets
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Grid3X3 className="w-4 h-4" />
              Add Widget
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {widgets.map(renderWidget)}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RevoxDashboard;