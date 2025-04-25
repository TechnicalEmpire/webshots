
import React, { useState } from "react";
import { WebshotImage } from "./WebshotViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDisplayDate, formatTimeDisplay } from "@/lib/date-utils";
import { groupImagesByDate } from "@/lib/mock-data";
import ImageViewer from "./ImageViewer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface GroupedImageGalleryProps {
  images: WebshotImage[];
  loading: boolean;
}

const GroupedImageGallery = ({ images, loading }: GroupedImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<WebshotImage | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const handleImageError = (imageId: string) => {
    setFailedImages(prev => new Set(prev).add(imageId));
  };

  const toggleSection = (dateKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={`skeleton-${index}`} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-[4/3] w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-3">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-muted rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No images found</h3>
        <p className="text-muted-foreground">
          No screenshots available with the current filters.
        </p>
      </div>
    );
  }

  // Group images by date
  const groupedByDate = groupImagesByDate(images);
  const dateKeys = Object.keys(groupedByDate).sort((a, b) => a.localeCompare(b));

  // Initialize all sections as open if not set
  dateKeys.forEach(date => {
    if (openSections[date] === undefined) {
      openSections[date] = true;
    }
  });

  return (
    <>
      <div className="space-y-6">
        {dateKeys.map((date) => (
          <div key={date} className="bg-white rounded-lg shadow-sm">
            <Collapsible
              open={openSections[date]}
              onOpenChange={() => toggleSection(date)}
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-indigo-50 rounded-t-lg hover:bg-indigo-100 transition-colors">
                <h3 className="text-md font-medium text-indigo-800">
                  {formatDisplayDate(date)}
                </h3>
                {openSections[date] ? (
                  <ChevronDown className="h-5 w-5 text-indigo-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-indigo-600" />
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                  {groupedByDate[date].map((image) => (
                    <Card 
                      key={image.id}
                      className="overflow-hidden border-border hover:border-primary/40 cursor-pointer image-container"
                      onClick={() => setSelectedImage(image)}
                    >
                      <CardContent className="p-0">
                        <div className="aspect-[4/3] w-full bg-muted overflow-hidden">
                          <img
                            src={failedImages.has(image.id) ? image.fallbackUrl : image.url}
                            alt={`${image.retailer} ${image.pageType} at ${image.time}`}
                            className="h-full w-full object-cover"
                            onError={() => handleImageError(image.id)}
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm truncate">
                            {image.retailer} - {image.originalPageType || image.pageType}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeDisplay(image.time)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          images={images}
          onNavigate={setSelectedImage}
          failedImages={failedImages}
          onImageError={handleImageError}
        />
      )}
    </>
  );
};

export default GroupedImageGallery;
