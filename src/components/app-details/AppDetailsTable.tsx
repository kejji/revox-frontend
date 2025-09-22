import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Apple, Bot, Star } from "lucide-react";
import { UpdateDialog } from "./UpdateDialog";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { useLanguage } from "@/contexts/LanguageContext";
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
export function AppDetailsTable({
  currentApp,
  linkedApps = [],
  className = ""
}: AppDetailsTableProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedUpdateText, setSelectedUpdateText] = useState("");
  const {
    t
  } = useLanguage();
  const renderStars = (rating: number) => Array.from({
    length: 5
  }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />);
  const handleShowMore = (updateText: string) => {
    setSelectedUpdateText(updateText);
    setShowUpdateDialog(true);
  };
  const allApps = [currentApp, ...linkedApps];
  return <div className={`${className}`}>
      {/* Desktop Layout */}
      <div className="hidden md:block space-y-1">
        {/* Header Row */}
        

        {/* App Rows */}
        {allApps.map((app, index) => (
          <div key={`${app.platform}-${app.bundleId}-${index}`}>
            {/* Desktop table row content would go here */}
          </div>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {allApps.map((app, index) => (
          <div key={`mobile-${app.platform}-${app.bundleId}-${index}`}>
          </div>
        ))}
      </div>

      <UpdateDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog} updateText={selectedUpdateText} appName={currentApp.name} />
    </div>;
}