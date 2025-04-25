import { useState, useEffect } from "react";
import { WebshotImage } from "./WebshotViewer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { formatFilenameDateAndTime, formatDisplayDate, formatTimeDisplay } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface EnhancedImageViewerProps {
  image: WebshotImage | null;
  onClose: () => void;
  images?: WebshotImage[];
  onNavigate?: (image: WebshotImage) => void;
  failedImages: Set<string>;
  onImageError: (imageId: string) => void;
  compareMode?: boolean;
  otherRetailerImages?: WebshotImage[];
  onOtherImageClick?: (image: WebshotImage) => void;
}

const EnhancedImageViewer = ({ 
  image, 
  onClose, 
  images = [], 
  onNavigate,
  failedImages,
  onImageError,
  compareMode = false,
  otherRetailerImages = [],
  onOtherImageClick
}: EnhancedImageViewerProps) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!image) return;
      
      if (compareMode) {
        if (onNavigate && e.key === "ArrowLeft" || e.key === "ArrowRight") {
          const images = [image, ...otherRetailerImages];
          const currentIndex = images.findIndex(img => img.id === image.id);
          if (currentIndex === -1) return;
          
          if (e.key === "ArrowLeft" && currentIndex > 0) {
            onNavigate(images[currentIndex - 1]);
          } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
            onNavigate(images[currentIndex + 1]);
          }
        }
      } else {
        if (onNavigate && images.length > 1) {
          const currentIndex = images.findIndex(img => img.id === image.id);
          if (currentIndex === -1) return;
          
          if (e.key === "ArrowLeft" && currentIndex > 0) {
            onNavigate(images[currentIndex - 1]);
            setLoaded(false);
          } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
            onNavigate(images[currentIndex + 1]);
            setLoaded(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, images, onNavigate, compareMode, otherRetailerImages]);

  if (!image) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-stretch justify-center p-4">
      <div className="max-w-[95vw] w-full flex gap-4">
        <div className="flex-1 flex flex-col bg-black/50 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-bh-navy to-bh-slate p-3 flex flex-col gap-1">
            <div className="flex justify-between items-center text-white">
              <div className="text-lg font-medium flex items-center gap-2">
                <span>{image.retailer}</span>
                <span className="text-sm text-white/60">•</span>
                <span className="text-sm">{image.originalPageType || image.pageType}</span>
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
            <div className="text-sm text-white/80">
              {formatDisplayDate(image.date)} at {formatTimeDisplay(image.time)}
            </div>
          </div>
          
          <div className="relative flex-1 flex items-center justify-center bg-black overflow-auto">
            <img
              src={failedImages.has(image.id) ? image.fallbackUrl : image.url}
              alt={`${image.retailer} ${image.originalPageType}`}
              className="max-w-full max-h-full object-contain"
              onLoad={() => setLoaded(true)}
              onError={() => {
                console.log(`Error loading image in viewer: ${image.url}`);
                console.log(`Will try to use fallback: ${image.fallbackUrl}`);
                onImageError(image.id);
                setLoaded(true);
              }}
            />
            
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="animate-pulse w-12 h-12 rounded-full bg-gray-700"></div>
              </div>
            )}
          </div>
        </div>

        {compareMode && otherRetailerImages && otherRetailerImages.length > 0 && (
          <div className="w-80 flex flex-col gap-2 overflow-y-auto">
            {otherRetailerImages.map((otherImage) => (
              <div
                key={otherImage.id}
                className={cn(
                  "bg-black/50 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all",
                  otherImage.id === image.id && "ring-2 ring-primary"
                )}
                onClick={() => onOtherImageClick?.(otherImage)}
              >
                <div className="bg-gradient-to-r from-bh-navy to-bh-slate p-2">
                  <div className="text-sm font-medium text-white">
                    {otherImage.retailer}
                  </div>
                </div>
                <div className="relative h-48">
                  <img
                    src={failedImages.has(otherImage.id) ? otherImage.fallbackUrl : otherImage.url}
                    alt={`${otherImage.retailer} ${otherImage.originalPageType}`}
                    className="w-full h-full object-cover"
                    onError={() => onImageError(otherImage.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedImageViewer;
