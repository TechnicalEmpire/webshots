import { useState } from "react";
import { WebshotImage, Retailer, PageType } from "./WebshotViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDisplayDate, formatTimeDisplay } from "@/lib/date-utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import EnhancedImageViewer from "./EnhancedImageViewer";

interface ImageGalleryProps {
  images: WebshotImage[];
  loading: boolean;
  retailer: Retailer;
  pageType: PageType;
  date: string;
  time: string;
}

const ImageGallery = ({ images, loading, retailer, pageType, date, time }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<WebshotImage | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageId: string) => {
    console.log(`Image failed to load: ${imageId}`);
    setFailedImages(prev => new Set(prev).add(imageId));
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
          No screenshots available for {retailer} {pageType} page on {formatDisplayDate(date)} at {formatTimeDisplay(time)}.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card 
            key={image.id}
            className="overflow-hidden border-border hover:border-primary/40 cursor-pointer image-container"
            onClick={() => setSelectedImage(image)}
          >
            <CardContent className="p-0">
              <AspectRatio ratio={4/3} className="bg-muted overflow-hidden">
                <img
                  src={failedImages.has(image.id) ? image.fallbackUrl : image.url}
                  alt={`${image.retailer} ${image.pageType} at ${image.time}`}
                  className="h-full w-full object-cover"
                  onError={() => handleImageError(image.id)}
                />
              </AspectRatio>
              <div className="p-3 space-y-1">
                <h4 className="font-medium text-sm truncate">
                  {image.retailer}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {image.originalPageType || image.pageType}
                </p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatDisplayDate(image.date)}</span>
                  <span>{formatTimeDisplay(image.time)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedImage && (
        <EnhancedImageViewer
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

export default ImageGallery;
