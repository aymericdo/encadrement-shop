import { RelevantAd } from "@/store/modules/relevantAd/interfaces";

export interface FilterState {
  surfaceValue: number[];
  roomValue: number[];
  priceValue: number[];
  furnishedValue: string;
  cityValue: string;
  isHouseValue: number | null;
  districtValues: never[];
  isLegal: boolean;
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
}
