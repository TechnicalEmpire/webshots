
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatDisplayDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface DateSliderProps {
  availableDates: string[];
  selectedDate: string;
  onChange: (date: string) => void;
}

const DateSlider = ({ availableDates, selectedDate, onChange }: DateSliderProps) => {
  const [sliderValue, setSliderValue] = useState<number>(0);

  // Initialize slider position based on selected date
  useEffect(() => {
    if (availableDates.length === 0) {
      console.log("No available dates for DateSlider");
      return;
    }
    
    const dateIndex = availableDates.indexOf(selectedDate);
    console.log(`DateSlider: Selected date ${selectedDate}, index ${dateIndex}, available dates:`, availableDates);
    
    if (dateIndex !== -1) {
      setSliderValue(dateIndex);
      console.log(`DateSlider: Setting slider value to ${dateIndex}`);
    } else if (availableDates.length > 0) {
      // Default to the most recent date if available
      const mostRecentIndex = availableDates.length - 1;
      setSliderValue(mostRecentIndex);
      console.log(`DateSlider: Setting slider to most recent date (${availableDates[mostRecentIndex]})`);
      onChange(availableDates[mostRecentIndex]);
    }
  }, [availableDates, selectedDate, onChange]);

  const handleSliderChange = (value: number[]) => {
    const newIndex = value[0];
    setSliderValue(newIndex);
    if (availableDates[newIndex]) {
      console.log(`DateSlider: Slider changed to date ${availableDates[newIndex]}`);
      onChange(availableDates[newIndex]);
    }
  };

  const goToPreviousDate = () => {
    if (sliderValue > 0) {
      const newValue = sliderValue - 1;
      setSliderValue(newValue);
      console.log(`DateSlider: Going to previous date ${availableDates[newValue]}`);
      onChange(availableDates[newValue]);
    }
  };

  const goToNextDate = () => {
    if (sliderValue < availableDates.length - 1) {
      const newValue = sliderValue + 1;
      setSliderValue(newValue);
      console.log(`DateSlider: Going to next date ${availableDates[newValue]}`);
      onChange(availableDates[newValue]);
    }
  };

  if (availableDates.length === 0) return null;

  return (
    <div className="space-y-2 w-full">
    <h4 className="font-medium text-sm">Date</h4>
 
      <div className="flex items-center space-x-2 bg-secondary/50 rounded-lg p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousDate}
          disabled={sliderValue <= 0}
          className={cn(
            "text-bh-navy hover:bg-secondary transition-colors", 
            sliderValue <= 0 && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 px-2">
        <div className="bg-secondary/50 rounded-lg px-2 py-1">
        <Slider
          value={[sliderValue]}
          max={availableDates.length - 1}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        </div>

        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextDate}
          disabled={sliderValue >= availableDates.length - 1}
          className={cn(
            "text-bh-navy hover:bg-secondary transition-colors", 
            sliderValue >= availableDates.length - 1 && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="text-center text-sm font-medium text-bh-navy">
        {availableDates[sliderValue] ? formatDisplayDate(availableDates[sliderValue]) : ""}
      </div>
    </div>
  );
};

export default DateSlider;
