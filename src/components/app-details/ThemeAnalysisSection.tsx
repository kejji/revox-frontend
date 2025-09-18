import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Play, Loader2 } from "lucide-react";
import { fetchThemesResult, launchThemeAnalysis, type ThemesResponse, type ThemeAxis } from "@/api";
import { AnalysisPeriodPicker } from "./AnalysisPeriodPicker";

interface ThemeAnalysisSectionProps {
  appPk: string;
  appName: string;
  onThemeClick: (theme: { theme: ThemeAxis; type: "positive" | "negative" }) => void;
  analysisFromDate: Date;
  analysisToDate: Date;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
  onValidate: () => void;
}

const ANALYSIS_STEPS = [
  "Prétraitement des données",
  "Représentation sémantique", 
  "Détection de thèmes",
  "Classification",
  "Analyse des thèmes"
];

export function ThemeAnalysisSection({
  appPk,
  appName,
  onThemeClick,
  analysisFromDate,
  analysisToDate,
  onFromDateChange,
  onToDateChange,
  onValidate
}: ThemeAnalysisSectionProps) {
  const [themesData, setThemesData] = useState<ThemesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial themes data
  const loadThemesData = async () => {
    setLoading(true);
    try {
      const data = await fetchThemesResult(appPk);
      setThemesData(data);
    } catch (error) {
      console.error("Failed to load themes data:", error);
      setThemesData(null);
    } finally {
      setLoading(false);
    }
  };

  // Launch new theme analysis
  const handleLaunchAnalysis = async () => {
    setLoading(true);
    try {
      const data = await launchThemeAnalysis(appPk, appName);
      setThemesData(data);
      if (data.status === "pending") {
        startPolling();
      }
    } catch (error) {
      console.error("Failed to launch theme analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start polling for analysis results
  const startPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const data = await fetchThemesResult(appPk);
        if (data.status === "done") {
          setThemesData(data);
          stopPolling();
        }
        // Cycle through steps for visual feedback
        setCurrentStepIndex(prev => (prev + 1) % ANALYSIS_STEPS.length);
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000);
  };

  // Stop polling
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    loadThemesData();
    return () => stopPolling();
  }, [appPk]);

  // Start polling if status is pending on mount
  useEffect(() => {
    if (themesData?.status === "pending") {
      startPolling();
    }
  }, [themesData?.status]);

  const renderThemeButtons = (themes: ThemeAxis[], type: "positive" | "negative") => {
    const colorClass = type === "positive" ? "green" : "orange";
    
    return (
      <div className="space-y-3">
        {themes.slice(0, 3).map((theme, i) => (
          <button
            key={i}
            onClick={() => onThemeClick({ theme, type })}
            className={`w-full p-3 text-left border rounded-lg hover:bg-muted/50 hover:border-${colorClass}-200 transition-all duration-200 group`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-${colorClass}-500 flex-shrink-0`} />
              <span className={`text-sm text-foreground group-hover:text-${colorClass}-700 transition-colors`}>
                {theme.axis_label}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 ml-4">
              Click to view sample comments
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderAnalysisStatus = () => {
    // Status is null - show launch button and historical data if available
    if (!themesData?.status) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Button
              onClick={handleLaunchAnalysis}
              disabled={loading}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {loading ? "Launching Analysis..." : "Launch Theme Analysis"}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Analyze user feedback to discover key themes and insights
            </p>
          </div>
          
          {/* Show historical data if available */}
          {themesData && (themesData.top_positive_axes.length > 0 || themesData.top_negative_axes.length > 0) && (
            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Previous analysis results</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-base font-medium text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Top 3 Positive Themes
                  </h3>
                  {themesData.top_positive_axes.length > 0 ? (
                    renderThemeButtons(themesData.top_positive_axes, "positive")
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No positive themes data available</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-base font-medium text-orange-600">
                    <TrendingDown className="h-4 w-4" />
                    Top 3 Negative Themes
                  </h3>
                  {themesData.top_negative_axes.length > 0 ? (
                    renderThemeButtons(themesData.top_negative_axes, "negative")
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No negative themes data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Status is pending - show spinner and cycling messages
    if (themesData?.status === "pending") {
      return (
        <div className="text-center space-y-6 py-12">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
            <div className="relative bg-background rounded-full p-6 border border-primary/20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Theme Analysis in Progress</h3>
            <p className="text-primary font-medium transition-all duration-700 animate-pulse">
              {ANALYSIS_STEPS[currentStepIndex]}
            </p>
            <p className="text-sm text-muted-foreground">
              This usually takes 1-2 minutes
            </p>
          </div>
        </div>
      );
    }

    // Status is done - show results
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-base font-medium text-green-600">
            <TrendingUp className="h-4 w-4" />
            Top 3 Positive Themes
          </h3>
          {themesData && themesData.top_positive_axes.length > 0 ? (
            renderThemeButtons(themesData.top_positive_axes, "positive")
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No positive themes data available</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-base font-medium text-orange-600">
            <TrendingDown className="h-4 w-4" />
            Top 3 Negative Themes
          </h3>
          {themesData && themesData.top_negative_axes.length > 0 ? (
            renderThemeButtons(themesData.top_negative_axes, "negative")
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No negative themes data available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="text-xl font-semibold">Theme Analysis</h2>
        <AnalysisPeriodPicker
          fromDate={analysisFromDate}
          toDate={analysisToDate}
          onFromDateChange={onFromDateChange}
          onToDateChange={onToDateChange}
          onValidate={onValidate}
          reviewsCount={themesData?.total_reviews_considered}
          lastUpdated={themesData?.created_at}
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        renderAnalysisStatus()
      )}
    </section>
  );
}