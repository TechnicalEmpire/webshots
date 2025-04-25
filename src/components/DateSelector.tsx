
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDisplayDate } from "@/lib/date-utils";

interface DateSelectorProps {
  availableDates: string[];
  selectedDate: string;
  onChange: (date: string) => void;
}

const DateSelector = ({ availableDates, selectedDate, onChange }: DateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setOpen(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < availableDates.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return;
    }
    
    onChange(availableDates[newIndex]);
  };

  // Convert string dates to Date objects for the calendar
  const enabledDates = availableDates.map(dateStr => new Date(dateStr));
  
  // Configure the disabled days
  const disabledDays = {
    before: new Date(availableDates[0]),
    after: new Date(availableDates[availableDates.length - 1]),
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-bh-navy">Date</h4>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 date-nav-button text-bh-navy"
          onClick={() => navigateDate('prev')}
          disabled={availableDates.indexOf(selectedDate) <= 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left text-bh-navy"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDisplayDate(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={new Date(selectedDate)}
              onSelect={handleSelectDate}
              disabled={disabledDays}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 date-nav-button text-bh-navy"
          onClick={() => navigateDate('next')}
          disabled={availableDates.indexOf(selectedDate) >= availableDates.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;
