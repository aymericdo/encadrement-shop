import { ActionTree, Commit } from "vuex";
import axios from "axios";
import { FilterState, RelevantAdState } from "./state-types";
import { domain } from "@/helper/config";
import { RelevantAdActionTypes } from "./action-types";
import { RelevantAdMutationType } from "./mutation-types";
import { RootState } from "@/store/types";
import { RelevantAd } from "@/store/modules/relevantAd/interfaces";

const PER_PAGE = 20;

interface CallbackSkeleton {
  (payload: RelevantAd[]): void;
}

const fetchData = (
  payload: {
    page?: number;
    filters: {
      surfaceValue: number[];
      roomValue: number[];
      priceValue: number[];
      furnishedValue: string;
      cityValue: string;
      districtValues: string[];
    };
  },
  commit: Commit,
  callback: CallbackSkeleton
) => {
  const page = payload.page && payload.page > 0 ? payload.page : 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = payload.filters;

  const strOptions: string = Object.keys(filters)
    .map((key: string) => {
      return key + "=" + filters[key];
    })
    .join("&");

  try {
    commit(RelevantAdMutationType.StartLoading);
    setTimeout(async () => {
      const response = await axios({
        url: `${domain}shop?page=${page}&perPage=${PER_PAGE}&${strOptions}`,
      });

      const payload: RelevantAd[] = response && response.data;
      const headers = response && response.headers;
      commit(RelevantAdMutationType.StopLoading);
      commit(
        RelevantAdMutationType.SetTotalPages,
        Math.ceil(headers["x-total-count"] / PER_PAGE)
      );
      callback(payload);
      // I'm a fucking asshole ↓
    }, 200);
  } catch (error) {
    console.log(error);
    commit(RelevantAdMutationType.AddError);
    commit(RelevantAdMutationType.StopLoading);
  }
};

export const actions: ActionTree<RelevantAdState, RootState> = {
  async [RelevantAdActionTypes.SetNewFilters](
    { commit },
    payload: {
      filters: FilterState;
    }
  ) {
    const options = {
      filters: payload.filters,
    };

    commit(RelevantAdMutationType.SetFilters, options.filters);

    fetchData(options, commit, (payload: RelevantAd[]) => {
      commit(RelevantAdMutationType.SetRelevantAds, payload);
    });
  },
  async [RelevantAdActionTypes.SetNewPage](
    { commit, getters },
    payload: {
      page: number;
    }
  ) {
    const options = {
      page: payload.page,
      filters: getters.getCurrentFilters,
    };

    fetchData(options, commit, (payload: RelevantAd[]) => {
      commit(RelevantAdMutationType.AddRelevantAds, payload);
      commit(RelevantAdMutationType.IncrementPage);
    });
  },
  async [RelevantAdActionTypes.SetDarkMode]({ commit, getters }) {
    commit(RelevantAdMutationType.SetDarkMode);
    const options = {
      filters: getters.getCurrentFilters,
    };
    fetchData(options, commit, (payload: RelevantAd[]) => {
      commit(RelevantAdMutationType.SetRelevantAds, payload);
    });
  },
  async [RelevantAdActionTypes.SetLegalMode]({ commit, getters }) {
    commit(RelevantAdMutationType.SetLegalMode);
    const options = {
      filters: getters.getCurrentFilters,
    };
    fetchData(options, commit, (payload: RelevantAd[]) => {
      commit(RelevantAdMutationType.SetRelevantAds, payload);
    });
  },
  async [RelevantAdActionTypes.SetDefaultFilter](
    { commit },
    payload: FilterState
  ) {
    commit(RelevantAdMutationType.SetDefaultFilter, payload);
  },
};
