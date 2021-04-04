import { GetterTree } from "vuex";
import { RelevantAdState } from "./state-types";
import { RelevantAd } from "@/store/modules/relevantAd/interfaces";
import { RootState } from "@/store/types";

export const getters: GetterTree<RelevantAdState, RootState> = {
  getRelevantAds(state): RelevantAd[] {
    const { relevantAdList } = state;
    return relevantAdList;
  },
  getCurrentPage(state): number {
    const { currentPage } = state;
    return currentPage;
  },
  getIsLoading(state): boolean {
    const { loading } = state;
    return loading;
  },
  getTotalPages(state): number | null {
    const { totalPages } = state;
    return totalPages;
  },
};
