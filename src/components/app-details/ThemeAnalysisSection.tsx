import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Play, Loader2 } from "lucide-react";
import { fetchThemesResult, scheduleThemeAnalysis, type ThemesResponse, type ThemeAxis } from "@/api";
import { useToast } from "@/hooks/use-toast";
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

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

  // Launch new theme analysis with orchestrated API calls
  const handleLaunchAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Step 1: Call PUT /themes/schedule?run_now=true
      const scheduleResult = await scheduleThemeAnalysis(appPk, appName);
      console.log("Schedule result:", scheduleResult);
      
      // Step 2: Check if job_id is not null
      if (!scheduleResult.run_now?.job_id) {
        console.log("No job_id received:", scheduleResult);
        toast({
          title: "Error",
          description: "Unable to start theme analysis. Please try again.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }
      
      // Step 3: Call GET /themes/result and start polling
      // Always start polling after launching analysis since it takes time to process
      startPolling();
      
    } catch (error) {
      console.error("Failed to launch theme analysis:", error);
      toast({
        title: "Error",
        description: "An error occurred while launching the analysis.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
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
        setThemesData(data);
        
        if (data.status === "done") {
          setIsAnalyzing(false);
          stopPolling();
        } else if (data.status === null) {
          // If status is still null, continue polling as analysis might not have started yet
          setCurrentStepIndex(prev => (prev + 1) % ANALYSIS_STEPS.length);
        } else if (data.status === "pending") {
          // Continue polling and cycle through steps
          setCurrentStepIndex(prev => (prev + 1) % ANALYSIS_STEPS.length);
        }
      } catch (error) {
        console.error("Polling error:", error);
        setIsAnalyzing(false);
        stopPolling();
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
        <div className="space-y-4 py-6">
          <Button
            onClick={handleLaunchAnalysis}
            disabled={isAnalyzing}
            className="gap-2 bg-primary/90 hover:bg-primary shadow-sm transition-all duration-200"
            size="default"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Analyze Themes
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
    if (themesData?.status === "pending" || isAnalyzing) {
      return (
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg font-medium">Analyse en cours...</span>
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