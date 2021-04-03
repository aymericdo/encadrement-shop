import { RelevantAd } from "@/interfaces/relevantAd";
import { MutationTree } from "vuex";
import { RelevantAdState } from "./types";

export const mutations: MutationTree<RelevantAdState> = {
  addRelevantAds(state, payload: RelevantAd[]) {
    state.error = false;
    state.relevantAdList = payload;
  },
  addError(state) {
    state.error = true;
    state.relevantAdList = [];
  },
};
