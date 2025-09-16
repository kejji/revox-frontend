import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, MessageSquare, ChevronRight } from "lucide-react";
import { ThemeAxis } from "@/api";
import { format } from "date-fns";

interface ThemeSamplesDialogProps {
  theme: ThemeAxis;
  isPositive: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeSamplesDialog({ 
  theme, 
  isPositive, 
  open, 
  onOpenChange 
}: ThemeSamplesDialogProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayedExamples = showAll ? theme.examples : theme.examples.slice(0, 3);
  const hasMore = theme.examples.length > 3;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.round(rating) 
            ? "text-yellow-500 fill-yellow-500" 
            : "text-muted-foreground"
        }`}
      />
    ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isPositive ? "bg-emerald-500" : "bg-orange-500"
            }`} />
            {theme.axis_label}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {theme.count} mentions
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {theme.avg_rating.toFixed(1)} avg rating
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              Sample Comments
            </h4>
            <Badge 
              variant="secondary" 
              className={`${
                isPositive 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300" 
                  : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300"
              }`}
            >
              {isPositive ? "Positive" : "Negative"} Theme
            </Badge>
          </div>

          <div className="space-y-3">
            {displayedExamples.map((example, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {renderStars(example.rating)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(example.date), "MMM dd, yyyy")}
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  "{example.text}"
                </p>
              </div>
            ))}
          </div>

          {hasMore && !showAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(true)}
              className="w-full mt-4 gap-2"
            >
              Show {theme.examples.length - 3} more examples
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {showAll && hasMore && (
            <Button
              variant="outline" 
              size="sm"
              onClick={() => setShowAll(false)}
              className="w-full mt-4"
            >
              Show less
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}