
import { Button } from "@/components/ui/button";
import { formatDisplayDate } from "@/lib/date-utils";

interface DateButtonSelectorProps {
  availableDates: string[];
  selectedDate: string;
  onChange: (date: string) => void;
}

const DateButtonSelector = ({ availableDates, selectedDate, onChange }: DateButtonSelectorProps) => {
  if (!availableDates || availableDates.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Date</h4>
      
      <div className="flex flex-wrap gap-2 max-w-3xl">
        {availableDates.map((date) => (
          <Button
            key={date}
            variant={selectedDate === date ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(date)}
            className={selectedDate === date ? "bg-indigo-600 hover:bg-indigo-700" : "text-indigo-700 border-indigo-300 hover:bg-indigo-100"}
          >
            {formatDisplayDate(date)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DateButtonSelector;
