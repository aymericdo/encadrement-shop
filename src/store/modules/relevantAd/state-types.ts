import { RelevantAd } from "@/store/modules/relevantAd/interfaces";

export interface FilterState {
  surfaceValue: number[];
  roomValue: number[];
  priceValue: number[];
  furnishedValue: string;
  cityValue: string;
  districtValues: never[];
}

export interface RelevantAdState {
  relevantAdList: RelevantAd[];
  loading: boolean;
  error: boolean;
  currentPage: number;
  currentFilters: FilterState;
  totalPages: number | null;
}
