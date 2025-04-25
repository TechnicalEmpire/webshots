
import { Checkbox } from "./ui/checkbox";
import { Label } from "@/components/ui/label";
import { Retailer } from "./WebshotViewer";

interface RetailerSelectorProps {
  selectedRetailers: Retailer[];
  onChange: (retailers: Retailer[]) => void;
}

const retailers: Retailer[] = ["Sweetwater", "Adorama", "Crutchfield", "BestBuy"];

const RetailerSelector = ({ selectedRetailers, onChange }: RetailerSelectorProps) => {
  const handleRetailerChange = (retailer: Retailer, checked: boolean) => {
    if (checked) {
      onChange([...selectedRetailers, retailer]);
    } else {
      onChange(selectedRetailers.filter((r) => r !== retailer));
    }
  };

  const handleSelectAll = () => {
    if (selectedRetailers.length === retailers.length) {
      onChange([]);
    } else {
      onChange([...retailers]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Retailer</h4>
        <button
          onClick={handleSelectAll}
          className="text-xs text-bh-navy hover:text-primary transition-colors"
        >
          {selectedRetailers.length === retailers.length ? "Deselect All" : "Select All"}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {retailers.map((retailer) => (
          <div key={retailer} className="flex items-center space-x-2">
            <Checkbox
              id={`retailer-${retailer}`}
              checked={selectedRetailers.includes(retailer)}
              onCheckedChange={(checked) => handleRetailerChange(retailer, checked as boolean)}
            />
            <Label
              htmlFor={`retailer-${retailer}`}
              className="text-sm font-normal cursor-pointer"
            >
              {retailer}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetailerSelector;
