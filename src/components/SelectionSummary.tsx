
import React from 'react';
import { Retailer, PageType } from "./WebshotViewer";
import { formatDisplayDate, formatTimeDisplay } from "@/lib/date-utils";

interface SelectionSummaryProps {
  selectedRetailers: Retailer[];
  selectedPageTypes: PageType[];
  selectedDate: string;
  viewMode: "filtered" | "all";
  timeViewMode: "single" | "all";
  selectedTime: string;
}

const SelectionSummary = ({
  selectedRetailers,
  selectedPageTypes,
  selectedDate,
  viewMode,
  timeViewMode,
  selectedTime,
}: SelectionSummaryProps) => {
  return (
    <div className="text-sm text-bh-slate space-y-1">
      <p><span className="font-medium">Retailer:</span> {selectedRetailers.join(", ")}</p>
      <p><span className="font-medium">Page Type:</span> {selectedPageTypes.join(", ")}</p>
      {viewMode === "filtered" ? (
        <>
          <p><span className="font-medium">Date:</span> {selectedDate ? formatDisplayDate(selectedDate) : "No date selected"}</p>
          <p><span className="font-medium">Time:</span> {timeViewMode === "all" ? "All Times" : formatTimeDisplay(selectedTime)}</p>
          <p><span className="font-medium">View:</span> Filtered</p>
        </>
      ) : (
        <p><span className="font-medium">View:</span> All Dates</p>
      )}
    </div>
  );
};

export default SelectionSummary;
