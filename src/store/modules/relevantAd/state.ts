import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { RelevantAdState } from "./state-types";
import { RootState } from "@/store/types";

export const initialFilters = {
  surfaceValue: [9, 100],
  roomValue: [1, 6],
  priceValue: [200, 3500],
  exceedingValue: [0, 500],
  furnishedValue: "all",
  cityValue: "all",
  isHouseValue: null,
  isLegal: true,
};

export const state: RelevantAdState = {
  relevantAdList: [],
  loading: false,
  error: false,
  mapMode: false,
  currentPage: 0,
  initialFilters,
  currentFilters: {
    ...initialFilters,
  },
  totalPages: null,
  cities: null,
};

const namespaced = true;

export const relevantAd: Module<RelevantAdState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
