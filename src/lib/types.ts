
import { WebshotImage } from "@/components/WebshotViewer";

// A retailer without the "All" option for internal use
export type RetailerInternal = "Sweetwater" | "Adorama" | "Crutchfield" | "BestBuy";

// A list of all internal retailers for iteration
export const internalRetailers: RetailerInternal[] = ["Sweetwater", "Adorama", "Crutchfield", "BestBuy"];

// Type for retailer records that don't include "All"
export type RetailerRecord<T> = Record<RetailerInternal, T>;

// Create a retailer record with initial values
export function createRetailerRecord<T>(initialValue: T): RetailerRecord<T> {
  return {
    Sweetwater: initialValue,
    Adorama: initialValue,
    Crutchfield: initialValue,
    BestBuy: initialValue
  };
}
