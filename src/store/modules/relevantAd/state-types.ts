import { RelevantAd } from "@/store/modules/relevantAd/interfaces";

export interface FilterState {
  surfaceValue: number[];
  roomValue: number[];
  priceValue: number[];
  exceedingValue?: number[];
  furnishedValue: string;
  cityValue: string;
  isHouseValue: number | null;
  isLegal: boolean;
}

export interface CityElement {
  mainCity: string;
  zones: string[] | { [key: string]: string[] };
  dateBuiltRange: [number, number][];
  hasHouse: true;
  coordinates: [number, number];
  displayName: {
    city: string;
    mainCity: string;
  };
}

export interface RelevantAdState {
  relevantAdList: RelevantAd[];
  loading: boolean;
  error: boolean;
  currentPage: number;
  initialFilters: FilterState;
  currentFilters: FilterState;
  totalPages: number | null;
  mapMode: boolean;
  cities: { [city: string]: CityElement } | null;
}
