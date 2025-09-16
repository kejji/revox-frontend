import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface AnalysisPeriodPickerProps {
  fromDate: Date;
  toDate: Date;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
  reviewsCount?: number;
  lastUpdated?: string;
}

export function AnalysisPeriodPicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  reviewsCount,
  lastUpdated,
}: AnalysisPeriodPickerProps) {
  const presetPeriods = [
    { label: "1 Month", action: () => onFromDateChange(subMonths(new Date(), 1)) },
    { label: "3 Months", action: () => onFromDateChange(subMonths(new Date(), 3)) },
    { label: "6 Months", action: () => onFromDateChange(subMonths(new Date(), 6)) },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Analysis Period</h4>
            <p className="text-sm text-muted-foreground">
              {format(fromDate, "MMM dd, yyyy")} - {format(toDate, "MMM dd, yyyy")}
            </p>
            {reviewsCount !== undefined && lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                {reviewsCount} reviews analyzed • Last updated: {format(new Date(lastUpdated), "MMM dd, HH:mm")}
              </p>
            )}
          </div>
          
          <div>
            <h5 className="font-medium text-sm mb-2">Quick Presets</h5>
            <div className="flex flex-col gap-1">
              {presetPeriods.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8 text-sm"
                  onClick={preset.action}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">From Date</label>
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={(date) => date && onFromDateChange(date)}
                disabled={(date) => date > new Date()}
                className={cn("rounded-md border pointer-events-auto")}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">To Date</label>
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={(date) => date && onToDateChange(date)}
                disabled={(date) => date > new Date() || date < fromDate}
                className={cn("rounded-md border pointer-events-auto")}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}