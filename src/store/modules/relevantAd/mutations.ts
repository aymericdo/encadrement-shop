import { RelevantAd } from "@/store/modules/relevantAd/interfaces";
import { MutationTree } from "vuex";
import { RelevantAdMutationType } from "./mutation-types";
import { RelevantAdState } from "./state-types";

export const mutations: MutationTree<RelevantAdState> = {
  [RelevantAdMutationType.AddRelevantAds](state, payload: RelevantAd[]) {
    state.error = false;
    const idsAlreadyHere = state.relevantAdList.map((ad) => ad._id);
    const uniqPayload = payload.filter(
      (ad) => !idsAlreadyHere.includes(ad._id)
    );
    state.relevantAdList = [...state.relevantAdList, ...uniqPayload];
  },
  [RelevantAdMutationType.AddError](state) {
    state.error = true;
    state.relevantAdList = [];
  },
  [RelevantAdMutationType.IncrementPage](state) {
    state.currentPage += 1;
  },
  [RelevantAdMutationType.StartLoading](state) {
    state.loading = true;
  },
  [RelevantAdMutationType.StopLoading](state) {
    state.loading = false;
  },
};
