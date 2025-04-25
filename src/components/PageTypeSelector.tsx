
import { PageType, Retailer } from "./WebshotViewer";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "@/components/ui/label";

interface PageTypeSelectorProps {
  selectedRetailer: Retailer;
  selectedPageTypes?: PageType[];
  selectedPageType?: PageType;
  onChange: (pageTypes: PageType[] | PageType) => void;
  useRadio?: boolean;
}

const PageTypeSelector = ({
  selectedRetailer,
  selectedPageTypes = [],
  selectedPageType = "Home",
  onChange,
  useRadio = false
}: PageTypeSelectorProps) => {
  const getPageTypes = (retailer: Retailer): PageType[] => {
    const pageTypes: PageType[] = ["Home", "Product", "Deal"];
    return pageTypes;
  };

  const pageTypes = getPageTypes(selectedRetailer);

  const handlePageTypeChange = (pageType: PageType, checked: boolean) => {
    if (useRadio) {
      onChange(pageType);
      return;
    }
    
    if (checked) {
      onChange([...selectedPageTypes, pageType]);
    } else {
      onChange(selectedPageTypes.filter((p) => p !== pageType));
    }
  };

  if (useRadio) {
    return (
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Page Type</h4>
        <RadioGroup 
          value={selectedPageType}
          onValueChange={(value) => onChange(value as PageType)}
        >
          {pageTypes.map((pageType) => (
            <div key={pageType} className="flex items-center space-x-2">
              <RadioGroupItem id={`page-${pageType}`} value={pageType} />
              <Label
                htmlFor={`page-${pageType}`}
                className="text-sm font-normal cursor-pointer"
              >
                {pageType}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Page Type</h4>
        <button
          onClick={() => onChange(selectedPageTypes.length === pageTypes.length ? [] : [...pageTypes])}
          className="text-xs text-bh-navy hover:text-primary transition-colors"
        >
          {selectedPageTypes.length === pageTypes.length ? "Deselect All" : "Select All"}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {pageTypes.map((pageType) => (
          <div key={pageType} className="flex items-center space-x-2">
            <Checkbox
              id={`page-${pageType}`}
              checked={selectedPageTypes.includes(pageType)}
              onCheckedChange={(checked) => handlePageTypeChange(pageType, checked as boolean)}
            />
            <Label
              htmlFor={`page-${pageType}`}
              className="text-sm font-normal cursor-pointer"
            >
              {pageType}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageTypeSelector;
