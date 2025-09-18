import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Play, Loader2 } from "lucide-react";
import { fetchThemesResult, launchThemeAnalysis, type ThemesResponse, type ThemeAxis } from "@/api";
import { AnalysisPeriodPicker } from "./AnalysisPeriodPicker";

interface ThemeAnalysisSectionProps {
  appPk: string;
  onThemeClick: (theme: { theme: ThemeAxis; type: "positive" | "negative" }) => void;
  analysisFromDate: Date;
  analysisToDate: Date;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
  onValidate: () => void;
}

const ANALYSIS_STEPS = [
  "Collecting reviews",
  "Cleaning data",
  "Analyzing text",
  "Processing feedback",
  "Building semantic map",
  "Understanding context",
  "Detecting patterns",
  "Identifying topics",
  "Grouping feedback",
  "Extracting insights",
  "Sorting positive and negative signals",
  "Highlighting key themes",
  "Structuring results",
  "Evaluating sentiment",
  "Classifying reviews",
  "Refining themes",
  "Summarizing findings",
  "Generating insights",
  "Validating analysis",
  "Preparing results"
];

export function ThemeAnalysisSection({
  appPk,
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
    try {
      // Fetch the results using GET /themes/result
      const data = await fetchThemesResult(appPk);
      setThemesData(data);
      
      // If status is pending, start polling
      if (data.status === "pending") {
        startPolling();
      }
    } catch (error) {
      console.error("Failed to launch theme analysis:", error);
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
        <div className="text-center space-y-4 py-6">
          <Button
            onClick={handleLaunchAnalysis}
            className="gap-2"
            size="lg"
          >
            <Play className="h-4 w-4" />
            Launch Theme Analysis
          </Button>
          
          {/* Show historical data if available */}
          {themesData && (themesData.top_positive_axes.length > 0 || themesData.top_negative_axes.length > 0) && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">Previous analysis results:</p>
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
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg font-medium">Analysis in progress...</span>
          </div>
          <p className="text-muted-foreground transition-all duration-500">
            {ANALYSIS_STEPS[currentStepIndex]}
          </p>
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