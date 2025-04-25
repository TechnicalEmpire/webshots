
import { format, eachDayOfInterval, parse, addDays } from "date-fns";

/**
 * Get all dates between start and end dates
 */
export function getDatesBetween(startDateStr: string, endDateStr: string): string[] {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: endDate
  });
  
  return dateRange.map(date => format(date, 'yyyy-MM-dd'));
}

/**
 * Format a date string for display - HACK: showing date as one day later
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    // Parse the date and add one day to show it as the next day
    const date = new Date(dateStr);
    const displayDate = addDays(date, 1);
    return format(displayDate, 'MMM d, yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateStr;
  }
}

/**
 * Parse a filename into components
 */
export function parseFilename(filename: string): {
  retailer: string;
  pageType: string;
  date: string;
  time: string;
} | null {
  console.log(`Parsing filename: ${filename}`);
  
  try {
    // First try the standard format with hyphens (e.g., "Sweetwater-Home-2025-01-06 09-20.png")
    const regex = /^(.*?)[-_](.*?)[-_](\d{4}-\d{2}-\d{2}) (\d{2}-\d{2})\.png$/;
    const match = filename.match(regex);
    
    if (match) {
      return {
        retailer: match[1],
        pageType: match[2],
        date: match[3],
        time: match[4]
      };
    }
    
    console.log(`Failed to parse filename: ${filename}`);
    return null;
  } catch (error) {
    console.error("Error parsing filename:", error);
    return null;
  }
}

/**
 * Format time string from "HH-MM" to "HH:MM AM/PM"
 */
export function formatTimeDisplay(timeStr: string): string {
  try {
    const [hours, minutes] = timeStr.split("-");
    const hour = parseInt(hours, 10);
    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'pm' : 'am';
    
    return `${displayHour}:${minutes}${ampm}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeStr;
  }
}

/**
 * Get available dates from the webshots directory
 * This function simulates getting folder names from the public/webshots directory
 */
export function getAvailableDates(): string[] {
  // In a production environment, this would make an API call to get folder names
  // For our demo, we'll use these hardcoded dates that match the folder structure
  const dates = [
    "2024-12-18",
    "2024-12-19",
    "2024-12-20",
    "2024-12-21",
    "2024-12-22",
    "2024-12-23",
    "2024-12-24",
    "2024-12-25",
    "2024-12-26",
    "2024-12-27",
    "2024-12-28",
    "2024-12-29",
    "2024-12-30",
    "2024-12-31",
    "2025-01-01",
    "2025-01-02",
    "2025-01-03",
    "2025-01-04",
    "2025-01-05",
    "2025-01-06"
  ];
  
  // Sort dates chronologically to ensure proper ordering
  dates.sort((a, b) => a.localeCompare(b));
  
  console.log("Available dates from folders:", dates);
  return dates;
}

/**
 * Format a filename into a display string
 */
export function formatFilenameDateAndTime(filename: string): string {
  try {
    const parsed = parseFilename(filename);
    if (parsed) {
      const date = formatDisplayDate(parsed.date);
      const time = formatTimeDisplay(parsed.time);
      return `${date} at ${time}`;
    }
    return filename;
  } catch (error) {
    console.error("Error formatting filename date and time:", error);
    return filename;
  }
}
