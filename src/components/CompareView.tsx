import React, { useState, useEffect } from "react";
import { PageType, WebshotImage, Retailer } from "./WebshotViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { getMockImages } from "@/lib/mock-data";
import { formatDisplayDate, formatTimeDisplay, formatFilenameDateAndTime, getAvailableDates } from "@/lib/date-utils";
import PageTypeSelector from "./PageTypeSelector";
import DateSelector from "./DateSelector";
import { useToast } from "@/components/ui/use-toast";
import ImageViewer from "./ImageViewer";
import EnhancedImageViewer from "./EnhancedImageViewer";
import RetailerImageThumbnails from "./RetailerImageThumbnails";
import { RetailerInternal, internalRetailers, createRetailerRecord, RetailerRecord } from "@/lib/types";
import DateSlider from "./DateSlider";

interface CompareViewProps {
  availableDates: string[];
}

const CompareView = ({ availableDates }: CompareViewProps) => {
  const { toast } = useToast();
  const [selectedPageType, setSelectedPageType] = useState<PageType>("Home");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("09-00");
  const [displayTime, setDisplayTime] = useState<string>("09-20");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [retailerImages, setRetailerImages] = useState<RetailerRecord<WebshotImage | null>>(
    createRetailerRecord(null)
  );
  const [retailerImageGroups, setRetailerImageGroups] = useState<RetailerRecord<WebshotImage[]>>(
    createRetailerRecord([])
  );
  const [loading, setLoading] = useState(true);
  const [timeIndex, setTimeIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<WebshotImage | null>(null);
  const [allImages, setAllImages] = useState<WebshotImage[]>([]);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [localAvailableDates, setLocalAvailableDates] = useState<string[]>([]);
  const [compareImages, setCompareImages] = useState<WebshotImage[]>([]);

  const handleImageError = (imageId: string) => {
    console.log(`Image failed to load: ${imageId}`);
    setFailedImages(prev => new Set(prev).add(imageId));
  };

  const handleEnlargedClose = () => {
    setEnlargedImage(null);
    setCompareImages([]);
  };

  const handleImageClick = (image: WebshotImage) => {
    setEnlargedImage(image);
    const currentHourImages = Object.values(retailerImages)
      .filter((img): img is WebshotImage => img !== null)
      .sort((a, b) => a.retailer.localeCompare(b.retailer));
    const otherImages = currentHourImages.filter(img => img.id !== image.id);
    setCompareImages(otherImages);
  };

  const handleThumbnailClick = (retailer: RetailerInternal, image: WebshotImage) => {
    const newRetailerImages = { ...retailerImages };
    newRetailerImages[retailer] = image;
    setRetailerImages(newRetailerImages);
  };

  useEffect(() => {
    const initializeDates = async () => {
      console.log("CompareView: Initializing available dates");
      
      if (availableDates && availableDates.length > 0) {
        console.log("CompareView: Using provided dates:", availableDates);
        setLocalAvailableDates(availableDates);
        const mostRecentDate = availableDates[availableDates.length - 1];
        console.log("CompareView: Setting most recent date:", mostRecentDate);
        setSelectedDate(mostRecentDate);
      } else {
        console.log("CompareView: Fetching dates directly");
        const dates = getAvailableDates();
        console.log("CompareView: Fetched dates:", dates);
        setLocalAvailableDates(dates);
        if (dates.length > 0) {
          const mostRecentDate = dates[dates.length - 1];
          console.log("CompareView: Setting most recent date:", mostRecentDate);
          setSelectedDate(mostRecentDate);
        }
      }
    };
    
    initializeDates();
  }, [availableDates]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      const times = [
        "09-00", "10-00", "11-00", "12-00", "13-00", "14-00", 
        "15-00", "16-00", "17-00", "18-00", "19-00", "20-00", "21-00", "22-00"
      ];
      setAvailableTimes(times);
      setSelectedTime(times[0]);
      setDisplayTime("09-20");
      setTimeIndex(0);
    };

    fetchAvailableTimes();
  }, [selectedDate]);

  useEffect(() => {
    const loadAllRetailerImages = async () => {
      if (!selectedDate) {
        console.log("CompareView: No date selected, skipping image load");
        return;
      }

      console.log(`CompareView: Loading images for ${selectedPageType} on ${selectedDate} at ${selectedTime}`);
      setLoading(true);
      
      try {
        const newRetailerImages = createRetailerRecord<WebshotImage | null>(null);
        const newRetailerImageGroups = createRetailerRecord<WebshotImage[]>([]);
        
        const allFetchedImages: WebshotImage[] = [];
        
        for (const retailer of internalRetailers) {
          console.log(`CompareView: Fetching images for ${retailer}`);
          const images = await getMockImages(
            retailer,
            selectedPageType,
            selectedDate
          );
          
          allFetchedImages.push(...images);
          
          const displayHour = selectedTime.split("-")[0];
          const hourImages = images.filter(img => img.time.startsWith(displayHour));
          
          if (hourImages.length > 0) {
            console.log(`CompareView: Found ${hourImages.length} images for ${retailer} at hour ${displayHour}`);
            newRetailerImages[retailer] = hourImages[0];
            newRetailerImageGroups[retailer] = hourImages;
          } else {
            console.log(`CompareView: No images found for ${retailer} at hour ${displayHour}`);
          }
        }
        
        console.log(`CompareView: Total images loaded: ${allFetchedImages.length}`);
        setAllImages(allFetchedImages);
        setRetailerImages(newRetailerImages);
        setRetailerImageGroups(newRetailerImageGroups);
      } catch (error) {
        console.error("Error loading comparison images:", error);
        toast({
          title: "Error",
          description: "Failed to load comparison images. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAllRetailerImages();
  }, [selectedPageType, selectedDate, selectedTime, toast]);

  const goToPreviousTime = () => {
    if (timeIndex > 0) {
      const newIndex = timeIndex - 1;
      setTimeIndex(newIndex);
      const newSelectedTime = availableTimes[newIndex];
      setSelectedTime(newSelectedTime);
      
      const hour = newSelectedTime.split("-")[0];
      setDisplayTime(`${hour}-20`);
    }
  };

  const goToNextTime = () => {
    if (timeIndex < availableTimes.length - 1) {
      const newIndex = timeIndex + 1;
      setTimeIndex(newIndex);
      const newSelectedTime = availableTimes[newIndex];
      setSelectedTime(newSelectedTime);
      
      const hour = newSelectedTime.split("-")[0];
      setDisplayTime(`${hour}-20`);
    }
  };

  const handlePageTypeChange = (pageType: PageType | PageType[]) => {
    if (Array.isArray(pageType)) {
      // In case we receive an array, just use the first item
      if (pageType.length > 0) {
        setSelectedPageType(pageType[0]);
      }
    } else {
      setSelectedPageType(pageType);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gradient-to-br from-white to-secondary/30">
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="space-y-4 md:space-y-0 md:space-x-6 flex flex-col md:flex-row md:items-end">
          <div className="w-full md:w-[200px]">
            <PageTypeSelector
              selectedRetailer="BestBuy"
              selectedPageType={selectedPageType}
              onChange={handlePageTypeChange}
              useRadio={true}
            />
          </div>
<div className="w-full md:w-[300px]">
          <DateSlider
          availableDates={localAvailableDates}
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
      
</div>
{/*}          <div className="w-full md:w-[300px]">
            <DateSelector
              availableDates={localAvailableDates}
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            /> 
          </div> */}
        </div>
      </div>
      
      <div className="border-t border-border pt-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-bh-navy">
            {selectedPageType} Pages on {formatDisplayDate(selectedDate)}
          </h2>
          
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-2 rounded-lg shadow-sm">
            <div className="text-lg font-medium text-bh-navy">
              {formatTimeDisplay(selectedTime)}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPreviousTime}
                disabled={timeIndex === 0}
                className="text-bh-navy border-bh-slate/30 hover:bg-secondary date-nav-button"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToNextTime}
                disabled={timeIndex === availableTimes.length - 1}
                className="text-bh-navy border-bh-slate/30 hover:bg-secondary date-nav-button"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internalRetailers.map((retailer) => (
            <Card key={retailer} className="overflow-hidden h-[500px] hover:shadow-lg transition-shadow duration-300 border-border">
              <div className="bg-gradient-to-r from-bh-navy to-bh-slate p-3 border-b text-white font-medium text-lg flex justify-between items-center">
                {retailer}
                {retailerImages[retailer] && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleImageClick(retailerImages[retailer]!)}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardContent className="p-0 flex flex-col h-[calc(100%-48px)]">
                {loading ? (
                  <div className="h-full w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : retailerImages[retailer] ? (
                  <>
                    <div 
                      className="relative cursor-pointer transition-transform hover:scale-[1.02] flex-grow overflow-auto"
                      onClick={() => handleImageClick(retailerImages[retailer]!)}
                      style={{ maxHeight: "calc(100% - 100px)" }}
                    >
                      <img
                        src={failedImages.has(retailerImages[retailer]!.id) 
                          ? retailerImages[retailer]!.fallbackUrl 
                          : retailerImages[retailer]!.url
                        }
                        alt={`${retailer} ${selectedPageType} page at ${formatTimeDisplay(displayTime)}`}
                        className="w-full h-auto object-contain max-h-full"
                        onError={() => {
                          if (retailerImages[retailer]) {
                            handleImageError(retailerImages[retailer]!.id);
                          }
                        }}
                      />
                    </div>
                    
                    {retailerImageGroups[retailer].length > 1 && (
                      <div className="px-2 py-2 border-t border-border mt-auto">
                        <RetailerImageThumbnails 
                          images={retailerImageGroups[retailer]}
                          onImageClick={(img) => handleThumbnailClick(retailer, img)}
                          failedImages={failedImages}
                          onImageError={handleImageError}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted/50 p-4 text-center">
                    <p className="text-muted-foreground">
                      {selectedPageType === "Deal" && retailer !== "BestBuy"
                        ? `${retailer} does not have Deal pages`
                        : `No image available for ${retailer} at this time`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {enlargedImage && (
        <EnhancedImageViewer
          image={enlargedImage}
          onClose={handleEnlargedClose}
          images={allImages}
          onNavigate={handleImageClick}
          failedImages={failedImages}
          onImageError={handleImageError}
          compareMode={true}
          otherRetailerImages={compareImages}
          onOtherImageClick={handleImageClick}
        />
      )}
    </div>
  );
};

export default CompareView;
