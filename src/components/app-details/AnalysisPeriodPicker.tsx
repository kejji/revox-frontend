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
import { useState } from "react";
import type { DateRange } from "react-day-picker";

interface AnalysisPeriodPickerProps {
  fromDate: Date;
  toDate: Date;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
  onValidate: () => void;
  reviewsCount?: number;
  lastUpdated?: string;
}

export function AnalysisPeriodPicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onValidate,
  reviewsCount,
  lastUpdated,
}: AnalysisPeriodPickerProps) {
  const [selectedOption, setSelectedOption] = useState<string>("3 Months");
  const [showCustom, setShowCustom] = useState(false);

  const presetOptions = [
    { 
      label: "1 Month", 
      value: "1 Month",
      action: () => {
        onFromDateChange(subMonths(new Date(), 1));
        setSelectedOption("1 Month");
        setShowCustom(false);
      }
    },
    { 
      label: "3 Months", 
      value: "3 Months",
      action: () => {
        onFromDateChange(subMonths(new Date(), 3));
        setSelectedOption("3 Months");
        setShowCustom(false);
      }
    },
    { 
      label: "6 Months", 
      value: "6 Months",
      action: () => {
        onFromDateChange(subMonths(new Date(), 6));
        setSelectedOption("6 Months");
        setShowCustom(false);
      }
    },
    { 
      label: "Custom", 
      value: "Custom",
      action: () => {
        setSelectedOption("Custom");
        setShowCustom(true);
      }
    },
  ];

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      onFromDateChange(range.from);
    }
    if (range?.to) {
      onToDateChange(range.to);
    }
  };

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
          
          <div className="space-y-2">
            {presetOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedOption === option.value ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start h-8 text-sm"
                onClick={option.action}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          {showCustom && (
            <div className="space-y-3 pt-2 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Date Range</label>
                <p className="text-xs text-muted-foreground mb-3">
                  Click to select start date, then click to select end date
                </p>
                <Calendar
                  mode="range"
                  selected={{ from: fromDate, to: toDate }}
                  onSelect={handleRangeSelect}
                  disabled={(date) => date > new Date()}
                  className={cn("rounded-md border pointer-events-auto")}
                  numberOfMonths={1}
                />
              </div>
            </div>
          )}
          
          <div className="pt-3 border-t">
            <Button onClick={onValidate} className="w-full" size="sm">
              Validate Analysis
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}