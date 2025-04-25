
import React from 'react';
import { Retailer, PageType } from "./WebshotViewer";
import RetailerSelector from "./RetailerSelector";
import PageTypeSelector from "./PageTypeSelector";
import DateSlider from "./DateSlider";
import ShowAllButton from "./ShowAllButton";

interface FilterControlsProps {
  selectedRetailers: Retailer[];
  selectedPageTypes: PageType[];
  availableDates: string[];
  selectedDate: string;
  viewMode: "filtered" | "all";
  onRetailerChange: (retailers: Retailer[]) => void;
  onPageTypeChange: (pageTypes: PageType[] | PageType) => void;
  onDateChange: (date: string) => void;
  onViewModeChange: (mode: "filtered" | "all") => void;
}

const FilterControls = ({
  selectedRetailers,
  selectedPageTypes,
  availableDates,
  selectedDate,
  viewMode,
  onRetailerChange,
  onPageTypeChange,
  onDateChange,
  onViewModeChange,
}: FilterControlsProps) => {
  const handleShowAll = () => onViewModeChange("all");
  const handleShowFiltered = () => onViewModeChange("filtered");

  return (
    <div className="space-y-6">
      <div>
        <RetailerSelector
          selectedRetailers={selectedRetailers}
          onChange={onRetailerChange}
        />
      </div>
      
      <div>
        <PageTypeSelector
          selectedRetailer={selectedRetailers[0] || "Sweetwater"}
          selectedPageTypes={selectedPageTypes}
          onChange={onPageTypeChange}
        />
      </div>
      
      {viewMode === "filtered" && (
        <DateSlider
          availableDates={availableDates}
          selectedDate={selectedDate}
          onChange={onDateChange}
        />
      )}
      
      <div >
        {viewMode === "filtered" ? (
          <ShowAllButton 
            onClick={handleShowAll} 
            label="Show All Dates" 
            isActive={false} 
          />
        ) : (
          <ShowAllButton 
            onClick={handleShowFiltered} 
            label="Return to Filtered View" 
            isActive={false} 
          />
        )}
      </div>
    </div>
  );
};

export default FilterControls;
