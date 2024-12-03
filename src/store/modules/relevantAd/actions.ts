import { ActionTree, Commit, Dispatch } from "vuex";
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
      exceedingValue?: number[];
      furnishedValue: string;
      cityValue: string;
      isLegal: boolean;
    };
  },
  commit: Commit,
  callback: CallbackSkeleton
) => {
  const page = payload.page && payload.page > 0 ? payload.page : 0;
  const filters: {
    surfaceValue: number[];
    roomValue: number[];
    priceValue: number[];
    exceedingValue?: number[];
    furnishedValue: string;
    cityValue: string;
    isLegal: boolean;
  } = payload.filters;

  if (filters.isLegal) {
    delete filters.exceedingValue;
  }

  const fields = Object.keys(filters) as (keyof typeof filters)[]

  const strOptions: string = fields.map((key) => {
    if (!filters[key] && filters[key] !== false) return null;
    return (key === 'cityValue' ? 'cityValue2' : key) + "=" + filters[key];
  })
  .filter(Boolean)
  .join("&");

  try {
    commit(RelevantAdMutationType.StartLoading);
    setTimeout(async () => {
      const response = await fetch(`${domain}shop?page=${page}&perPage=${PER_PAGE}&${strOptions}`);

      const payload: RelevantAd[] = await response.json();
      const headers = response.headers;
      const totalCount: string = headers.get("x-total-count") || '';
      commit(RelevantAdMutationType.StopLoading);
      commit(
        RelevantAdMutationType.SetTotalPages,
        Math.ceil(parseInt(totalCount) || 0 / PER_PAGE)
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

const fetchDataUntilTheEnd = (
  getters: any,
  dispatch: Dispatch
) => {
  if (
    getters.getIsMapMode &&
    getters.getCurrentPage + 1 < getters.getTotalPages
  ) {
    if (getters.getCurrentFilters.cityValue === 'all' &&
      getters.getCurrentPage < 5) { 
      dispatch(RelevantAdActionTypes.SetNewPage, {
        page: getters.getCurrentPage + 1,
      });
    }
  }
};

const fetchCities = async (commit: Commit) => {
  try {
    const response = await fetch(`${domain}cities/list`);

    const payload: RelevantAd[] = await response.json();
    commit(RelevantAdMutationType.SetCities, payload);
  } catch (err) {
    console.error(err);
  }
};

export const actions: ActionTree<RelevantAdState, RootState> = {
  async [RelevantAdActionTypes.SetNewFilters](
    { commit, getters, dispatch },
    payload: {
      filters: FilterState;
    }
  ) {
    const options = {
      filters: payload.filters,
    };

    commit(RelevantAdMutationType.SetFilters, options.filters);

    fetchData(options, commit, (payload: RelevantAd[]) => {
      fetchDataUntilTheEnd(getters, dispatch);
      commit(RelevantAdMutationType.SetRelevantAds, payload);
    });
  },
  async [RelevantAdActionTypes.SetNewPage](
    { commit, getters, dispatch },
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
      fetchDataUntilTheEnd(getters, dispatch);
    });
  },
  async [RelevantAdActionTypes.SetDarkMode]({ commit, getters, dispatch }) {
    commit(RelevantAdMutationType.SetDarkMode);
    const options = {
      filters: getters.getCurrentFilters,
    };
    fetchData(options, commit, (payload: RelevantAd[]) => {
      fetchDataUntilTheEnd(getters, dispatch);
      commit(RelevantAdMutationType.SetRelevantAds, payload);
    });
  },
  async [RelevantAdActionTypes.SetLegalMode]({ commit, getters, dispatch }) {
    commit(RelevantAdMutationType.SetLegalMode);
    const options = {
      filters: getters.getCurrentFilters,
    };
    fetchData(options, commit, (payload: RelevantAd[]) => {
      fetchDataUntilTheEnd(getters, dispatch);
      commit(RelevantAdMutationType.SetRelevantAds, payload);
    });
  },
  async [RelevantAdActionTypes.SetDefaultFilter](
    { commit },
    payload: FilterState
  ) {
    commit(RelevantAdMutationType.SetDefaultFilter, payload);
  },
  async [RelevantAdActionTypes.SetMapMode](
    { commit, getters, dispatch },
    payload: boolean
  ) {
    commit(RelevantAdMutationType.SetMapMode, payload);
    fetchDataUntilTheEnd(getters, dispatch);
  },
  async [RelevantAdActionTypes.FetchingCities]({ commit }) {
    fetchCities(commit);
  },
};
