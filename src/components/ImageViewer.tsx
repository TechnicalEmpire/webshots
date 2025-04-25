
import { useState, useEffect } from "react";
import { WebshotImage } from "./WebshotViewer";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { formatFilenameDateAndTime } from "@/lib/date-utils";

interface ImageViewerProps {
  image: WebshotImage | null;
  onClose: () => void;
  images?: WebshotImage[];
  onNavigate?: (image: WebshotImage) => void;
  failedImages: Set<string>;
  onImageError: (imageId: string) => void;
  showNavigation?: boolean;
}

const ImageViewer = ({ 
  image, 
  onClose, 
  images = [], 
  onNavigate,
  failedImages,
  onImageError,
  showNavigation = true
}: ImageViewerProps) => {
  const [loaded, setLoaded] = useState(false);
  
  // Guard against null image
  if (!image) {
    return null;
  }
  
  // Make sure we have a valid image and images array before calculating indices
  const currentIndex = image && images.length > 0 ? 
    images.findIndex(img => img && img.id === image.id) : -1;
  const hasNext = currentIndex > -1 && currentIndex < images.length - 1;
  const hasPrevious = currentIndex > -1 && currentIndex > 0;
  
  const handlePrevious = () => {
    if (hasPrevious && onNavigate) {
      onNavigate(images[currentIndex - 1]);
      setLoaded(false);
    }
  };
  
  const handleNext = () => {
    if (hasNext && onNavigate) {
      onNavigate(images[currentIndex + 1]);
      setLoaded(false);
    }
  };

  // For debugging purposes, let's log the current image URLs
  console.log(`Current image URL: ${image.url}`);
  console.log(`Fallback URL: ${image.fallbackUrl}`);
  console.log(`Using fallback: ${failedImages.has(image.id)}`);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="max-w-screen-xl w-full bg-white rounded-lg shadow-2xl overflow-hidden relative">
        <div className="bg-gradient-to-r from-bh-navy to-bh-slate p-3 flex justify-between items-center text-white">
          <div className="text-lg font-medium">
            {formatFilenameDateAndTime(image.filename)}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative bg-gray-100 flex justify-center max-h-[80vh] overflow-auto">
          <img
            src={failedImages.has(image.id) ? image.fallbackUrl : image.url}
            alt={`${image.retailer} ${image.originalPageType}`}
            className="max-w-full object-contain max-h-[80vh]"
            onLoad={() => setLoaded(true)}
            onError={() => {
              console.log(`Error loading image in viewer: ${image.url}`);
              console.log(`Will try to use fallback: ${image.fallbackUrl}`);
              onImageError(image.id);
              setLoaded(true);
            }}
          />
          
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="animate-pulse w-12 h-12 rounded-full bg-gray-300"></div>
            </div>
          )}
        </div>
        
        {showNavigation && images.length > 1 && (
          <div className="flex justify-between p-3 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={!hasNext}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
