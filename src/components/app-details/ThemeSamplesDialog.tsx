import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Apple, Bot } from "lucide-react";
import { ThemeAxis } from "@/api";

interface ThemeSamplesDialogProps {
  theme: ThemeAxis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "positive" | "negative";
}

export function ThemeSamplesDialog({ theme, open, onOpenChange, type }: ThemeSamplesDialogProps) {
  if (!theme) return null;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
        }`}
      />
    ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${type === "positive" ? "bg-green-500" : "bg-orange-500"}`} />
            {theme.axis_label}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{theme.count} mentions</span>
            <span>Average rating: {theme.avg_rating}/5</span>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {theme.examples.map((example, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(example.rating)}</div>
                    <span className="text-xs text-muted-foreground">
                      {example.rating}/5
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(example.date).toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed">{example.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}