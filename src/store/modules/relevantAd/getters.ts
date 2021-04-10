import { GetterTree } from "vuex";
import { FilterState, RelevantAdState } from "./state-types";
import { RelevantAd } from "@/store/modules/relevantAd/interfaces";
import { RootState } from "@/store/types";
import { initialFilters } from "./state";

export const getters: GetterTree<RelevantAdState, RootState> = {
  getRelevantAds(state): RelevantAd[] {
    const { relevantAdList } = state;
    return relevantAdList;
  },
  getCurrentPage(state): number {
    const { currentPage } = state;
    return currentPage;
  },
  getCurrentFilters(
    state
  ): {
    surfaceValue: number[];
    roomValue: number[];
    priceValue: number[];
    furnishedValue: string;
    cityValue: string;
    districtValues: never[];
  } {
    const { currentFilters } = state;
    return currentFilters;
  },
  getIsLoading(state): boolean {
    const { loading } = state;
    return loading;
  },
  getTotalPages(state): number | null {
    const { totalPages } = state;
    return totalPages;
  },
  getFiltersCount(state: RelevantAdState): number | null {
    const { currentFilters } = state;
    let cpt = 0;
    (Object.keys(currentFilters) as (keyof FilterState)[]).forEach((key) => {
      if (
        JSON.stringify(currentFilters[key]) !==
        JSON.stringify(initialFilters[key])
      ) {
        cpt += 1;
      }
    });
    return cpt;
  },
};
