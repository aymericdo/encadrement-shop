export interface RelevantAd {
  _id: string;
  id: string;
  surface: number;
  roomCount: number;
  website: string;
  createdAt: Date;
  hasFurniture: boolean;
  price: number;
  district: string;
  city: string;
  url: string;
  isHouse?: boolean;
  latitude?: string;
  longitude?: string;
  blurry?: boolean;
}
