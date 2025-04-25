
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatTimeDisplay } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import ShowAllButton from "@/components/ShowAllButton";

interface TimeControlsProps {
  timeIndex: number;
  availableTimes: string[];
  selectedTime: string;
  timeViewMode: "single" | "all";
  onTimeChange: (time: string, index: number) => void;
  onTimeViewModeChange: (mode: "single" | "all") => void;
  displayTime: string;
}

const TimeControls = ({
  timeIndex,
  availableTimes,
  selectedTime,
  timeViewMode,
  onTimeChange,
  onTimeViewModeChange,
  displayTime,
}: TimeControlsProps) => {
  const goToPreviousTime = () => {
    if (timeIndex > 0) {
      const newIndex = timeIndex - 1;
      const newSelectedTime = availableTimes[newIndex];
      onTimeChange(newSelectedTime, newIndex);
    }
  };

  const goToNextTime = () => {
    if (timeIndex < availableTimes.length - 1) {
      const newIndex = timeIndex + 1;
      const newSelectedTime = availableTimes[newIndex];
      onTimeChange(newSelectedTime, newIndex);
    }
  };

  const handleShowAllTimes = () => onTimeViewModeChange("all");
  const handleShowSingleTime = () => onTimeViewModeChange("single");

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Time</h4>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousTime}
          disabled={timeIndex === 0 || timeViewMode === "all"}
          className="text-bh-navy border-bh-slate/30 hover:bg-secondary date-nav-button"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 px-2">
          <Slider 
            value={[timeIndex]} 
            max={availableTimes.length - 1} 
            step={1} 
            onValueChange={(value) => {
              const newIndex = value[0];
              const newSelectedTime = availableTimes[newIndex];
              onTimeChange(newSelectedTime, newIndex);
            }}
            className="bg-secondary/50"
            disabled={timeViewMode === "all"}
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextTime}
          disabled={timeIndex === availableTimes.length - 1 || timeViewMode === "all"}
          className="text-bh-navy border-bh-slate/30 hover:bg-secondary date-nav-button"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-center text-sm font-medium text-bh-navy">
        {formatTimeDisplay(selectedTime)}
      </div>
      <div className="mt-2 flex">
        {timeViewMode === "single" ? (
          <ShowAllButton 
            onClick={handleShowAllTimes} 
            label="Show All Times" 
            isActive={false} 
          />
        ) : (
          <ShowAllButton 
            onClick={handleShowSingleTime} 
            label="Show Single Time" 
            isActive={false} 
          />
        )}
      </div>
    </div>
  );
};

export default TimeControls;
