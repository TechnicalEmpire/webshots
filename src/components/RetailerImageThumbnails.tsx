
import React from 'react';
import { WebshotImage } from './WebshotViewer';
import { formatTimeDisplay } from '@/lib/date-utils';

interface RetailerImageThumbnailsProps {
  images: WebshotImage[];
  onImageClick: (image: WebshotImage) => void;
  failedImages: Set<string>;
  onImageError: (imageId: string) => void;
}

const RetailerImageThumbnails = ({
  images,
  onImageClick,
  failedImages,
  onImageError,
}: RetailerImageThumbnailsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto p-1">
      {images.map((image) => (
        <button
          key={image.id}
          onClick={() => onImageClick(image)}
          className="flex-none relative group"
        >
          <div className="w-16 h-16 overflow-hidden rounded border border-border">
            <img
              src={failedImages.has(image.id) ? image.fallbackUrl : image.url}
              alt={`${image.retailer} at ${formatTimeDisplay(image.time)}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              onError={() => onImageError(image.id)}
            />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {formatTimeDisplay(image.time)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RetailerImageThumbnails;
