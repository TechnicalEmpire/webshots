import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageGallery from "@/components/ImageGallery";
import GroupedImageGallery from "@/components/GroupedImageGallery";
import CompareView from "@/components/CompareView";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getAvailableDates } from "@/lib/date-utils";
import { getMockImages } from "@/lib/mock-data";
import FilterControls from "./FilterControls";
import TimeControls from "./TimeControls";
import SelectionSummary from "./SelectionSummary";

export type Retailer = "Sweetwater" | "Adorama" | "Crutchfield" | "BestBuy" | "All";
export type PageType = "Home" | "Product" | "Deal" | "All";

export interface WebshotImage {
  id: string;
  retailer: Retailer;
  pageType: PageType;
  date: string;
  time: string;
  filename: string;
  url: string;
  fallbackUrl: string;
  originalPageType: string;
}

const WebshotViewer = () => {
  const { toast } = useToast();
  const [selectedRetailers, setSelectedRetailers] = useState<Retailer[]>(["Sweetwater"]);
  const [selectedPageTypes, setSelectedPageTypes] = useState<PageType[]>(["Home"]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [images, setImages] = useState<WebshotImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedTime, setSelectedTime] = useState<string>("09-00");
  const [displayTime, setDisplayTime] = useState<string>("09-20");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [timeIndex, setTimeIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"filtered" | "all">("filtered");
  const [timeViewMode, setTimeViewMode] = useState<"single" | "all">("single");

  useEffect(() => {
    const fetchDates = async () => {
      console.log("Fetching available dates from folder structure");
      const dates = getAvailableDates();
      console.log("Fetched dates:", dates);
      
      setAvailableDates(dates);
      
      if (dates.length > 0) {
        const mostRecentDate = dates[dates.length - 1];
        console.log("Setting most recent date:", mostRecentDate);
        setSelectedDate(mostRecentDate);
      }
    };
    
    fetchDates();
  }, []);

  useEffect(() => {
    const times = [
      "09-00", "10-00", "11-00", "12-00", "13-00", "14-00", 
      "15-00", "16-00", "17-00", "18-00", "19-00", "20-00", "21-00", "22-00"
    ];
    setAvailableTimes(times);
    setSelectedTime(times[0]);
    setDisplayTime("09-20");
    setTimeIndex(0);
  }, []);

  useEffect(() => {
    if (activeTab !== "browse" || !selectedDate) return;
    
    const loadImages = async () => {
      setLoading(true);
      try {
        console.log(`Loading images for retailers: ${selectedRetailers.join(", ")}, page types: ${selectedPageTypes.join(", ")}, ${selectedDate}`);
        
        let allImages: WebshotImage[] = [];
        
        for (const retailer of selectedRetailers) {
          for (const pageType of selectedPageTypes) {
            const fetchedImages = await getMockImages(
              retailer,
              pageType,
              selectedDate
            );
            allImages = [...allImages, ...fetchedImages];
          }
        }
        
        if (timeViewMode === "single") {
          const hourPart = selectedTime.split("-")[0];
          allImages = allImages.filter(img => img.time === `${hourPart}-20`);
        }
        
        console.log(`Loaded ${allImages.length} images`);
        setImages(allImages);
      } catch (error) {
        console.error("Error loading images:", error);
        toast({
          title: "Error",
          description: "Failed to load images. Please try again.",
          variant: "destructive",
        });
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [selectedRetailers, selectedPageTypes, selectedDate, selectedTime, toast, activeTab, timeViewMode]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split("-");
    return `${hours}:${minutes}`;
  };

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

  const handleShowAll = () => {
    setViewMode("all");
  };

  const handleShowFiltered = () => {
    setViewMode("filtered");
  };

  const handleShowAllRetailers = () => {
    setSelectedRetailers(["Sweetwater", "Adorama", "Crutchfield", "BestBuy"]);
  };

  const handleShowAllPageTypes = () => {
    setSelectedPageTypes(["Home", "Product", "Deal"]);
  };

  const handleShowAllTimes = () => {
    setTimeViewMode("all");
  };

  const handleShowSingleTime = () => {
    setTimeViewMode("single");
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="browse" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-gradient-to-r from-primary to-bh-navy px-4 py-2 border-b">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/20 text-white">
            <TabsTrigger 
              value="browse" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Browse Images
            </TabsTrigger>
            <TabsTrigger 
              value="compare" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Compare View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browse" className="p-0 m-0">
          <div className="grid md:grid-cols-12 gap-4 p-4 bg-gradient-to-br from-white to-secondary/30">
            <div className="md:col-span-3 space-y-4">
              <Card className="card-gradient shadow-md border-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4 text-bh-navy">Filters</h3>
                  
                  <FilterControls
                    selectedRetailers={selectedRetailers}
                    selectedPageTypes={selectedPageTypes}
                    availableDates={availableDates}
                    selectedDate={selectedDate}
                    viewMode={viewMode}
                    onRetailerChange={setSelectedRetailers}
                    onPageTypeChange={(pageTypes) => {
                      if (Array.isArray(pageTypes)) {
                        setSelectedPageTypes(pageTypes);
                      } else {
                        setSelectedPageTypes([pageTypes]);
                      }
                    }}
                    onDateChange={setSelectedDate}
                    onViewModeChange={setViewMode}
                  />

                  {viewMode === "filtered" && (
                    <TimeControls
                      timeIndex={timeIndex}
                      availableTimes={availableTimes}
                      selectedTime={selectedTime}
                      timeViewMode={timeViewMode}
                      onTimeChange={(time, index) => {
                        setTimeIndex(index);
                        setSelectedTime(time);
                        const hour = time.split("-")[0];
                        setDisplayTime(`${hour}-20`);
                      }}
                      onTimeViewModeChange={setTimeViewMode}
                      displayTime={displayTime}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Card className="card-gradient shadow-md border-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-2 text-bh-navy">Current Selection</h3>
                  <SelectionSummary
                    selectedRetailers={selectedRetailers}
                    selectedPageTypes={selectedPageTypes}
                    selectedDate={selectedDate}
                    viewMode={viewMode}
                    timeViewMode={timeViewMode}
                    selectedTime={selectedTime}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-9">
              {viewMode === "filtered" ? (
                <ImageGallery
                  images={images}
                  loading={loading}
                  retailer={selectedRetailers.length === 1 ? selectedRetailers[0] : "All"}
                  pageType={selectedPageTypes.length === 1 ? selectedPageTypes[0] : "All"}
                  date={selectedDate}
                  time={timeViewMode === "all" ? "All Times" : displayTime}
                />
              ) : (
                <GroupedImageGallery
                  images={images}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="p-0 m-0">
          <CompareView availableDates={availableDates} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebshotViewer;
