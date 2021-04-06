import { ActionTree } from "vuex";
import axios from "axios";
import { RelevantAdState } from "./state-types";
import { domain } from "@/helper/config";
import { RelevantAdActionTypes } from "./action-types";
import { RelevantAdMutationType } from "./mutation-types";
import { RootState } from "@/store/types";
import { RelevantAd } from "@/store/modules/relevantAd/interfaces";

const PER_PAGE = 20;

export const actions: ActionTree<RelevantAdState, RootState> = {
  async [RelevantAdActionTypes.FetchRelevantAdsWithNewFilters](
    { commit },
    payload: {
      page: number;
      filters: {
        surfaceValue: number[];
        roomValue: number[];
        furnishedValue: string;
        cityValue: string;
        districtValues: string[];
        priceValue: number[];
      };
    }
  ) {
    const page = 0;
    const filters: any = payload.filters;
    commit(RelevantAdMutationType.SetFilters, filters);

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
        commit(RelevantAdMutationType.SetRelevantAds, payload);
        commit(RelevantAdMutationType.StopLoading);
        commit(
          RelevantAdMutationType.SetTotalPages,
          Math.ceil(headers["x-total-count"] / PER_PAGE)
        );
        // I'm a fuckin asshole ↓
      }, 200);
    } catch (error) {
      console.log(error);
      commit(RelevantAdMutationType.AddError);
      commit(RelevantAdMutationType.StopLoading);
    }
  },
  async [RelevantAdActionTypes.FetchRelevantAdsWithNewPage](
    { commit },
    payload: {
      page: number;
      filters: {
        surfaceValue: number[];
        roomValue: number[];
        priceValue: number[];
        furnishedValue: string;
        cityValue: string;
        districtValues: string[];
      };
    }
  ) {
    const page = payload.page < 0 ? 0 : payload.page;
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
        commit(RelevantAdMutationType.AddRelevantAds, payload);
        commit(RelevantAdMutationType.StopLoading);
        commit(RelevantAdMutationType.IncrementPage);
        commit(
          RelevantAdMutationType.SetTotalPages,
          Math.ceil(headers["x-total-count"] / PER_PAGE)
        );
        // I'm a fuckin asshole ↓
      }, 200);
    } catch (error) {
      console.log(error);
      commit(RelevantAdMutationType.AddError);
      commit(RelevantAdMutationType.StopLoading);
    }
  },
};
