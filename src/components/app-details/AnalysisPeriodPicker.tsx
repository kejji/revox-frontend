import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subMonths, subWeeks } from "date-fns";
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
    { label: "1M", action: () => onFromDateChange(subMonths(new Date(), 1)) },
    { label: "3M", action: () => onFromDateChange(subMonths(new Date(), 3)) },
    { label: "6M", action: () => onFromDateChange(subMonths(new Date(), 6)) },
  ];

  return (
    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-2 flex-wrap">
        <span>Period:</span>
        
        {/* Quick preset buttons */}
        <div className="flex gap-1">
          {presetPeriods.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={preset.action}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        
        {/* From Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs justify-start font-normal"
            >
              <CalendarIcon className="h-3 w-3 mr-1" />
              {format(fromDate, "MMM dd")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => date && onFromDateChange(date)}
              disabled={(date) => date > new Date()}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <span>to</span>
        
        {/* To Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs justify-start font-normal"
            >
              <CalendarIcon className="h-3 w-3 mr-1" />
              {format(toDate, "MMM dd")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => date && onToDateChange(date)}
              disabled={(date) => date > new Date() || date < fromDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {reviewsCount !== undefined && lastUpdated && (
        <div className="text-xs text-muted-foreground">
          {reviewsCount} reviews analyzed • Last updated: {format(new Date(lastUpdated), "MMM dd, HH:mm")}
        </div>
      )}
    </div>
  );
}