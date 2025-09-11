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

  // Check if text should be truncated (more than 40 characters)
  const isUpdateTextTruncated = (text: string) => text.length > 40;

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
      {/* Desktop Layout */}
      <div className="hidden md:block space-y-1">
        {/* Header Row */}
        <div className="grid grid-cols-[32px_140px_200px_1fr] gap-6 pb-2">
          <div></div>
          <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Version</h4>
          <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Rating</h4>
          <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Latest Update</h4>
        </div>

        {/* App Rows */}
        {allApps.map((app, index) => (
          <div key={`${app.platform}-${app.bundleId}-${index}`} className="grid grid-cols-[32px_140px_200px_1fr] gap-6 items-center py-2">
            {/* Platform Icon */}
            <div className="flex justify-center">
              {app.platform === "ios" ? (
                <Apple className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {/* Version */}
            <div className="font-medium">{app.version}</div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(Math.floor(app.rating))}</div>
              <span className="font-medium">{app.rating}</span>
              {app.ratingCount && (
                <span className="text-xs text-muted-foreground">({app.ratingCount})</span>
              )}
            </div>

            {/* Latest Update */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-foreground truncate flex-1 line-clamp-2">
                {app.latestUpdate}
              </p>
              {isUpdateTextTruncated(app.latestUpdate) && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-primary flex-shrink-0"
                  onClick={() => handleShowMore(app.latestUpdate)}
                >
                  See more
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {allApps.map((app, index) => (
          <div key={`mobile-${app.platform}-${app.bundleId}-${index}`} className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            {/* Platform Badge */}
            <div className="flex items-center gap-2">
              {app.platform === "ios" ? (
                <Apple className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-muted-foreground" />
              )}
              <Badge variant="secondary" className="text-xs font-medium">
                {app.platform.toUpperCase()}
              </Badge>
            </div>
            
            {/* Version + Rating Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Version</p>
                <p className="font-semibold text-base">{app.version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(Math.floor(app.rating))}</div>
                  <span className="font-semibold text-base">{app.rating}</span>
                  {app.ratingCount && (
                    <span className="text-xs text-muted-foreground">({app.ratingCount})</span>
                  )}
                </div>
              </div>
            </div>

            {/* Last Update Section */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Latest Update</p>
              <div className="space-y-2">
                <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                  {app.latestUpdate}
                </p>
                {isUpdateTextTruncated(app.latestUpdate) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3 text-xs text-muted-foreground hover:text-primary w-full justify-center"
                    onClick={() => handleShowMore(app.latestUpdate)}
                  >
                    See more
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