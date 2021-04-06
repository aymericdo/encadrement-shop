import { RelevantAd } from "@/store/modules/relevantAd/interfaces";

export interface RelevantAdState {
  relevantAdList: RelevantAd[];
  loading: boolean;
  error: boolean;
  currentPage: number;
  currentFilters: {
    surfaceValue: number[];
    roomValue: number[];
    priceValue: number[];
    furnishedValue: string;
    cityValue: string;
    districtValues: never[];
  };
  totalPages: number | null;
}
