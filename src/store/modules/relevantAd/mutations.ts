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
  [RelevantAdMutationType.SetRelevantAds](state, payload: RelevantAd[]) {
    state.error = false;
    state.relevantAdList = [...payload];
  },
  [RelevantAdMutationType.AddError](state) {
    state.error = true;
    state.relevantAdList = [];
  },
  [RelevantAdMutationType.IncrementPage](state) {
    state.currentPage += 1;
  },
  [RelevantAdMutationType.SetFilters](state, payload) {
    state.currentPage = 0;
    state.currentFilters = {
      ...payload,
      isLegal: state.currentFilters.isLegal,
    };
  },
  [RelevantAdMutationType.SetTotalPages](state, payload) {
    state.totalPages = payload;
  },
  [RelevantAdMutationType.StartLoading](state) {
    state.loading = true;
  },
  [RelevantAdMutationType.StopLoading](state) {
    state.loading = false;
  },
  [RelevantAdMutationType.SetMapMode](state, payload) {
    state.mapMode = payload;
  },
  [RelevantAdMutationType.SetDarkMode](state) {
    state.currentPage = 0;
    state.initialFilters = {
      ...state.initialFilters,
      isLegal: false,
    };
    state.currentFilters = {
      ...state.currentFilters,
      isLegal: false,
    };
  },
  [RelevantAdMutationType.SetLegalMode](state) {
    state.currentPage = 0;
    state.initialFilters = {
      ...state.initialFilters,
      isLegal: true,
    };
    state.currentFilters = {
      ...state.currentFilters,
      isLegal: true,
    };
  },
  [RelevantAdMutationType.SetDefaultFilter](state, payload) {
    state.initialFilters = {
      exceedingValue: state.initialFilters.exceedingValue,
      ...payload,
      isLegal: state.initialFilters.isLegal,
    };
    state.currentFilters = {
      exceedingValue: state.currentFilters.exceedingValue,
      ...payload,
      isLegal: state.currentFilters.isLegal,
    };
  },
};
