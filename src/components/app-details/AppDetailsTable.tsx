import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Apple, Bot, Star } from "lucide-react";
import { UpdateDialog } from "./UpdateDialog";

interface AppData {
  name: string;
  version: string;
  rating: number;
  ratingCount?: number;
  latestUpdate: string;
  lastUpdatedAt?: string;
  platform: "ios" | "android";
  bundleId: string;
}

interface AppDetailsTableProps {
  currentApp: AppData;
  linkedApps?: AppData[];
  className?: string;
}

export function AppDetailsTable({ currentApp, linkedApps = [], className = "" }: AppDetailsTableProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedUpdateText, setSelectedUpdateText] = useState("");

  // Check if text should be truncated (more than 60 characters)
  const isUpdateTextTruncated = (text: string) => text.length > 60;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
      />
    ));

  const handleShowMore = (updateText: string) => {
    setSelectedUpdateText(updateText);
    setShowUpdateDialog(true);
  };

  const allApps = [currentApp, ...linkedApps];

  return (
    <div className={`${className}`}>
      {/* Modern Card Layout */}
      <div className="grid gap-3 md:grid-cols-3">
        {allApps.map((app, index) => (
          <div key={`${app.platform}-${app.bundleId}-${index}`} className="bg-muted/20 rounded-lg p-4 border border-border/50 hover:border-border/70 transition-all duration-200">
            {/* Platform & Version */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {app.platform === "ios" ? (
                  <Apple className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Bot className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-semibold text-foreground">{app.version}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {app.platform.toUpperCase()}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">{renderStars(Math.floor(app.rating))}</div>
              <span className="font-semibold text-sm">{app.rating}</span>
            </div>

            {/* Latest Update */}
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Latest Update</p>
              <div className="space-y-2">
                <p className="text-sm text-foreground leading-relaxed">
                  {isUpdateTextTruncated(app.latestUpdate) 
                    ? `${app.latestUpdate.substring(0, 80)}...` 
                    : app.latestUpdate}
                </p>
                {isUpdateTextTruncated(app.latestUpdate) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs font-medium"
                    onClick={() => handleShowMore(app.latestUpdate)}
                  >
                    Show more
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <UpdateDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        updateText={selectedUpdateText}
        appName={currentApp.name}
      />
    </div>
  );
}