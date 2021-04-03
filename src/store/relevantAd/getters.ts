import { GetterTree } from "vuex";
import { RelevantAdState } from "./types";
import { RootState } from "../types";
import { RelevantAd } from "@/interfaces/relevantAd";

export const getters: GetterTree<RelevantAdState, RootState> = {
  getRelevantAds(state): RelevantAd[] {
    const { relevantAdList } = state;
    return relevantAdList;
  },
};
