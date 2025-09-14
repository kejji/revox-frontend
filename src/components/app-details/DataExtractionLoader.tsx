import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Apple, Bot } from "lucide-react";

interface DataExtractionLoaderProps {
  appName?: string;
  platform?: "ios" | "android";
  onComplete?: () => void;
}

const extractionSteps = [
  "Connecting to app store...",
  "Analyzing app metadata...", 
  "Extracting recent reviews...",
  "Processing user feedback...",
  "Organizing data by sentiment...",
  "Finalizing extraction..."
];

export function DataExtractionLoader({ appName, platform, onComplete }: DataExtractionLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepText, setStepText] = useState(extractionSteps[0]);

  useEffect(() => {
    const duration = 8000; // 8 seconds total
    const stepDuration = duration / extractionSteps.length;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration / 100));
        
        // Update step text based on progress
        const newStep = Math.floor(newProgress / (100 / extractionSteps.length));
        if (newStep !== currentStep && newStep < extractionSteps.length) {
          setCurrentStep(newStep);
          setStepText(extractionSteps[newStep]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep, onComplete]);

  const storeName = platform === "ios" ? "App Store" : "Google Play Store";
  const StoreIcon = platform === "ios" ? Apple : Bot;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <StoreIcon className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Extracting from {storeName}</span>
            </div>
            
            <h3 className="text-xl font-bold text-foreground">
              {appName || "Loading app data..."}
            </h3>
            
            <p className="text-sm text-muted-foreground">
              We're gathering the latest reviews and data for your app. This may take a moment for first-time extraction.
            </p>
          </div>

          <div className="space-y-4">
            <Progress 
              value={progress} 
              className="w-full"
            />
            
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {stepText}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}