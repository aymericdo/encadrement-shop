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
  async [RelevantAdActionTypes.FetchRelevantAds](
    { commit },
    payload: { page: number }
  ) {
    const page = payload.page;

    try {
      commit(RelevantAdMutationType.StartLoading);
      setTimeout(async () => {
        const response = await axios({
          url: `${domain}shop?page=${page}&perPage=${PER_PAGE}`,
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
