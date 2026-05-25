export type GearCategory =
  | "shelter"
  | "furniture"
  | "kitchen"
  | "lighting"
  | "bedding"
  | "other";

export interface GearItem {
  id: string;
  slug: string;
  name: string;
  nameChinese: string;
  category: GearCategory;
  dailyPrice: number; // TWD
  description: string;
  descriptionChinese: string;
  images: string[];
  specs: { label: string; value: string }[];
  featured?: boolean;
}

export interface GearBundle {
  id: string;
  slug: string;
  name: string;
  nameChinese: string;
  tier: "solo" | "standard" | "deluxe";
  tagline: string;
  description: string;
  itemIds: string[];
  bundlePrice: number; // TWD per weekend (Fri–Sun)
  originalPrice: number; // sum of individual daily prices × 2 nights
  images: string[];
  featured?: boolean;
}

export interface BookingItem {
  type: "item" | "bundle";
  id: string;
  name: string;
  price: number;
  quantity: number;
}
