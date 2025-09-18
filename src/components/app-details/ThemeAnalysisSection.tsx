import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Play } from "lucide-react";
import { fetchThemesResult, launchThemeAnalysis, type ThemesResponse, type ThemeAxis } from "@/api";

interface ThemeAnalysisSectionProps {
  appPk: string;
  onThemeSelect: (theme: { theme: ThemeAxis; type: "positive" | "negative" }) => void;
}

export function ThemeAnalysisSection({ appPk, onThemeSelect }: ThemeAnalysisSectionProps) {
  const [themesData, setThemesData] = useState<ThemesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  };

  const startProgressAnimation = () => {
    setProgress(0);
    const duration = 80000; // 80 seconds total
    const interval = 100; // Update every 100ms
    const increment = 100 / (duration / interval);
    
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 95) {
          // Stop at 95% and let the actual completion trigger 100%
          if (progressRef.current) {
            clearInterval(progressRef.current);
            progressRef.current = null;
          }
          return 95;
        }
        return newProgress;
      });
    }, interval);
  };

  const checkAnalysisStatus = async () => {
    try {
      const data = await fetchThemesResult(appPk);
      setThemesData(data);
      
      if (data.status === "done") {
        setAnalyzing(false);
        setProgress(100);
        stopPolling();
      } else if (data.status === "pending") {
        if (!analyzing) {
          setAnalyzing(true);
          startProgressAnimation();
        }
        // Continue polling
        if (!pollingRef.current) {
          pollingRef.current = setInterval(() => {
            checkAnalysisStatus();
          }, 5000);
        }
      } else if (data.status === "null" || !data.status) {
        setAnalyzing(false);
        stopPolling();
      }
    } catch (error) {
      console.error("Failed to check analysis status:", error);
      setAnalyzing(false);
      stopPolling();
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    await checkAnalysisStatus();
    setLoading(false);
  };

  const handleLaunchAnalysis = async () => {
    try {
      setAnalyzing(true);
      setProgress(0);
      await launchThemeAnalysis(appPk);
      startProgressAnimation();
      
      // Start polling for status updates
      pollingRef.current = setInterval(() => {
        checkAnalysisStatus();
      }, 5000);
    } catch (error) {
      console.error("Failed to launch analysis:", error);
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (appPk) {
      loadInitialData();
    }
    
    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appPk]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              Top 3 Positive Themes
            </h3>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-medium text-orange-600">
              <TrendingDown className="h-4 w-4" />
              Top 3 Negative Themes
            </h3>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show launch button if no analysis exists or status is null
  if (!themesData || themesData.status === "null" || !themesData.status) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8 border border-dashed border-border/50 rounded-lg">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Launch Theme Analysis</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Analyze your app reviews to identify key themes and user sentiment patterns
              </p>
            </div>
            <Button onClick={handleLaunchAnalysis} disabled={analyzing} className="gap-2">
              <Play className="h-4 w-4" />
              Start Analysis
            </Button>
          </div>
        </div>

        {/* Show top 3 themes if we have historical data */}
        {themesData && (themesData.top_positive_axes.length > 0 || themesData.top_negative_axes.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive Themes */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-base font-medium text-green-600">
                <TrendingUp className="h-4 w-4" />
                Top 3 Positive Themes
              </h3>
              <div className="space-y-3">
                {themesData.top_positive_axes.slice(0, 3).map((theme, i) => (
                  <button
                    key={i}
                    onClick={() => onThemeSelect({ theme, type: "positive" })}
                    className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 hover:border-green-200 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-sm text-foreground group-hover:text-green-700 transition-colors">
                        {theme.axis_label}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 ml-4">
                      Click to view sample comments
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Themes */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-base font-medium text-orange-600">
                <TrendingDown className="h-4 w-4" />
                Top 3 Negative Themes
              </h3>
              <div className="space-y-3">
                {themesData.top_negative_axes.slice(0, 3).map((theme, i) => (
                  <button
                    key={i}
                    onClick={() => onThemeSelect({ theme, type: "negative" })}
                    className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 hover:border-orange-200 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                      <span className="text-sm text-foreground group-hover:text-orange-700 transition-colors">
                        {theme.axis_label}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 ml-4">
                      Click to view sample comments
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show progress bar if analysis is pending
  if (analyzing || themesData.status === "pending") {
    return (
      <div className="space-y-6">
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Analyzing Themes</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Processing your app reviews to identify key themes and patterns
              </p>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="w-full max-w-xs mx-auto" />
              <p className="text-xs text-muted-foreground">
                Analysis in progress...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show results if analysis is done
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Positive Themes */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-base font-medium text-green-600">
          <TrendingUp className="h-4 w-4" />
          Top 3 Positive Themes
        </h3>
        <div className="space-y-3">
          {themesData.top_positive_axes.length > 0 ? (
            themesData.top_positive_axes.slice(0, 3).map((theme, i) => (
              <button
                key={i}
                onClick={() => onThemeSelect({ theme, type: "positive" })}
                className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 hover:border-green-200 transition-all duration-200 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground group-hover:text-green-700 transition-colors">
                    {theme.axis_label}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-4">
                  Click to view sample comments
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No positive themes identified</p>
            </div>
          )}
        </div>
      </div>

      {/* Negative Themes */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-base font-medium text-orange-600">
          <TrendingDown className="h-4 w-4" />
          Top 3 Negative Themes
        </h3>
        <div className="space-y-3">
          {themesData.top_negative_axes.length > 0 ? (
            themesData.top_negative_axes.slice(0, 3).map((theme, i) => (
              <button
                key={i}
                onClick={() => onThemeSelect({ theme, type: "negative" })}
                className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 hover:border-orange-200 transition-all duration-200 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="text-sm text-foreground group-hover:text-orange-700 transition-colors">
                    {theme.axis_label}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-4">
                  Click to view sample comments
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No negative themes identified</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}