
import { WebshotImage, Retailer, PageType } from "@/components/WebshotViewer";
import { parseFilename, getAvailableDates } from "./date-utils";
import { RetailerInternal, RetailerRecord, createRetailerRecord } from "./types";

// Map various page type strings to our standardized PageType values
export const categorizePageType = (pageTypeString: string): PageType => {
  const lowerCaseType = pageTypeString.toLowerCase();
  
  if (lowerCaseType === "home") {
    return "Home";
  }
  
  if (lowerCaseType === "product") {
    return "Product";
  }
  
  // All deal-related pages are categorized as "Deal"
  if (
    lowerCaseType.includes("deal") || 
    lowerCaseType.includes("deals") || 
    lowerCaseType.includes("daily") || 
    lowerCaseType.includes("holiday")
  ) {
    return "Deal";
  }
  
  // Default to Home if unknown
  return "Home";
};

// Generate the image URL based on retailer, page type, date and time
export const getImageUrl = (retailer: string, filename: string, date: string): string => {
  // Extract the retailer name from the filename for more accurate directory matching
  const filenameRetailer = filename.split('-')[0].split('_')[0];
  
  // We need to properly handle spaces in filenames for URL paths
  // First, construct the path using directory separators
  const path = `/webshots/${date}/${filenameRetailer}/${filename}`;
  
  // Now properly encode the entire path, but preserve the forward slashes
  const encodedPath = path.split('/').map(segment => 
    segment ? encodeURIComponent(segment).replace(/%20/g, ' ') : ''
  ).join('/');
  
  console.log(`Original path: ${path}`);
  console.log(`Encoded path: ${encodedPath}`);
  
  return encodedPath;
};

// Fallback to placeholder image if the actual image fails to load
export const getImagePlaceholderUrl = (retailer: string, pageType: string, date: string, time: string): string => {
  return `https://placehold.co/1200x900/e6e6e6/5d5d5d?text=${encodeURIComponent(retailer)}+${encodeURIComponent(pageType)}%0A${encodeURIComponent(date)}+${encodeURIComponent(time)}`;
};

// Hard-coded filenames by date to simulate API response
// In a real implementation, this would be replaced by a server call to get the actual files
// For our purposes, we'll maintain this to have consistent test data
const filesByDate: Record<string, string[]> = {
  "2025-01-01": [
    "Adorama-Daily Deals-2025-01-01 09-20.png",
    "Adorama-Daily Deals-2025-01-01 11-20.png",
    "Adorama-Deals of the Day-2025-01-01 09-20.png",
    "Adorama-Deals of the Day-2025-01-01 11-20.png",
    "Adorama-Deals-2025-01-01 09-20.png",
    "Adorama-Deals-2025-01-01 11-20.png",
    "Adorama-Home-2025-01-01 09-20.png",
    "Adorama-Home-2025-01-01 11-20.png",
    "Adorama-Product-2025-01-01 09-20.png",
    "Adorama-Product-2025-01-01 11-20.png",
    "BestBuy-Deals-2025-01-01 09-20.png",
    "BestBuy-Deals-2025-01-01 10-20.png",
    "BestBuy-Home-2025-01-01 09-20.png",
    "BestBuy-Home-2025-01-01 11-20.png",
    "BestBuy-Product-2025-01-01 09-20.png",
    "BestBuy-Product-2025-01-01 11-20.png",
    "Crutchfield_Home_2025-01-01 09-20.png",
    "Crutchfield_Home_2025-01-01 10-20.png",
    "Crutchfield_Home_2025-01-01 11-20.png",
    "Sweetwater-Home-2025-01-01 10-20.png",
    "Sweetwater-Home-2025-01-01 11-20.png",
    "Sweetwater-Product-2025-01-01 09-20.png",
    "Sweetwater_Deal of the Day_2025-01-01 11-20.png",
    "Sweetwater_Deals_2025-01-01 11-20.png",
    "Sweetwater_Holiday Deal_2025-01-01 11-20.png",
    "Sweetwater_Product_2025-01-01 11-20.png"
  ],
  "2024-12-31": [
    "Adorama-Home-2024-12-31 09-20.png",
    "BestBuy-Home-2024-12-31 09-20.png",
    "Crutchfield_Home_2024-12-31 09-20.png",
    "Sweetwater-Home-2024-12-31 09-20.png"
  ],
  "2025-01-06": [
    "Adorama-Home-2025-01-06 09-20.png",
    "BestBuy-Home-2025-01-06 09-20.png",
    "Crutchfield_Home_2025-01-06 09-20.png",
    "Sweetwater-Home-2025-01-06 09-20.png"
  ]
};

// Initialize filesByDate for all available dates
const initializeFilesByDate = () => {
  const availableDates = getAvailableDates();
  
  // For dates we don't have explicit data for, create empty arrays
  availableDates.forEach(date => {
    if (!filesByDate[date]) {
      filesByDate[date] = [];
    }
  });
};

// Call this once to initialize
initializeFilesByDate();

// Fetch the actual image files for a given date
export const fetchAvailableImages = async (date: string): Promise<string[]> => {
  try {
    console.log(`Fetching available images for date: ${date}`);
    
    // Check if we have hardcoded files for this date
    if (filesByDate[date]) {
      console.log(`Found ${filesByDate[date].length} files for date ${date}`);
      return filesByDate[date];
    }
    
    // Return an empty array if no files found for the date
    console.log(`No files found for date ${date}`);
    return [];
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

// Fetch all images across all dates
export const fetchAllImages = async (): Promise<string[]> => {
  try {
    let allFiles: string[] = [];
    
    // Combine all files from all dates
    Object.values(filesByDate).forEach(files => {
      allFiles = [...allFiles, ...files];
    });
    
    console.log(`Found ${allFiles.length} files across all dates`);
    return allFiles;
  } catch (error) {
    console.error("Error fetching all images:", error);
    return [];
  }
};

// Get all available retailers
export const getAllRetailers = async (): Promise<Retailer[]> => {
  const allFiles = await fetchAllImages();
  const retailers = new Set<Retailer>();
  const validRetailers: Retailer[] = ["Sweetwater", "Adorama", "Crutchfield", "BestBuy"];
  
  allFiles.forEach(filename => {
    const parsed = parseFilename(filename);
    if (parsed && validRetailers.includes(parsed.retailer as Retailer)) {
      retailers.add(parsed.retailer as Retailer);
    }
  });
  
  return Array.from(retailers);
};

// Get all available page types
export const getAllPageTypes = async (): Promise<PageType[]> => {
  const pageTypes = new Set<PageType>();
  pageTypes.add("Home");
  pageTypes.add("Product");
  pageTypes.add("Deal");
  
  return Array.from(pageTypes);
};

// Get images for a specific retailer, page type and date
export const getMockImages = async (
  retailer: Retailer | "All",
  pageType: PageType | "All",
  date: string | "All"
): Promise<WebshotImage[]> => {
  console.log(`Getting mock images for ${retailer}, ${pageType}, ${date}`);
  
  let availableFiles: string[] = [];
  
  if (date === "All") {
    availableFiles = await fetchAllImages();
  } else {
    // Fetch all available images for the date
    availableFiles = await fetchAvailableImages(date);
  }
  
  // Parse the filenames
  const allImages = parseWebshotFiles(availableFiles);
  
  // Filter by retailer and page type if not "All"
  let filteredImages = allImages;
  
  if (retailer !== "All") {
    filteredImages = filteredImages.filter(img => img.retailer === retailer);
  }
  
  if (pageType !== "All") {
    filteredImages = filteredImages.filter(img => img.pageType === pageType);
  }
  
  // Sort images by date
  filteredImages.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.time.localeCompare(b.time);
  });
  
  console.log(`Found ${filteredImages.length} images for ${retailer}, ${pageType}, ${date}`);
  
  return filteredImages;
};

// Parse webshot files from a directory
export const parseWebshotFiles = (files: string[]): WebshotImage[] => {
  const images: WebshotImage[] = [];
  
  // Define valid retailers for type checking
  const validRetailers: Retailer[] = ["Sweetwater", "Adorama", "Crutchfield", "BestBuy"];
  
  files.forEach((filename, index) => {
    try {
      const parsed = parseFilename(filename);
      
      if (parsed) {
        let { retailer, pageType, date, time } = parsed;
        
        // Validate retailer - cast to Retailer type only if valid, otherwise use default
        const standardizedRetailer: Retailer = validRetailers.includes(retailer as Retailer) 
          ? retailer as Retailer 
          : "Sweetwater";
        
        // Standardize the page type using our categorization function
        const standardizedPageType: PageType = categorizePageType(pageType);
        
        // Generate URL to the actual file in public directory
        const fileUrl = getImageUrl(retailer, filename, date);
        
        images.push({
          id: `${index}-${filename}`,
          retailer: standardizedRetailer,
          pageType: standardizedPageType,
          date,
          time,
          filename,
          url: fileUrl,
          fallbackUrl: getImagePlaceholderUrl(retailer, pageType, date, time),
          originalPageType: pageType
        });
        
        console.log(`Parsed image: ${retailer}, ${standardizedPageType}, ${date}, ${time}, ${fileUrl}`);
      } else {
        console.log(`Failed to parse filename: ${filename}`);
      }
    } catch (error) {
      console.error(`Error parsing file ${filename}:`, error);
    }
  });
  
  return images;
};

// Group images by retailer and time slot
export const groupImagesByRetailerAndTime = (
  images: WebshotImage[]
): Record<RetailerInternal, Record<string, WebshotImage[]>> => {
  const groupedImages = createRetailerRecord<Record<string, WebshotImage[]>>({});

  images.forEach(image => {
    // Skip "All" retailer (we only want to group concrete retailers)
    if (image.retailer === "All") return;
    
    // Cast because we know it's a concrete retailer now
    const retailer = image.retailer as RetailerInternal;
    
    if (!groupedImages[retailer][image.time]) {
      groupedImages[retailer][image.time] = [];
    }
    groupedImages[retailer][image.time].push(image);
  });

  return groupedImages;
};

// Group images by date
export const groupImagesByDate = (
  images: WebshotImage[]
): Record<string, WebshotImage[]> => {
  const groupedImages: Record<string, WebshotImage[]> = {};

  images.forEach(image => {
    if (!groupedImages[image.date]) {
      groupedImages[image.date] = [];
    }
    groupedImages[image.date].push(image);
  });

  return groupedImages;
};
