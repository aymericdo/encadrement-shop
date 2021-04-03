import { ActionTree } from "vuex";
import axios from "axios";
import { RelevantAdState } from "./types";
import { RootState } from "../types";
import { RelevantAd } from "../../interfaces/relevantAd";
import { domain } from "@/helper/config";

export const actions: ActionTree<RelevantAdState, RootState> = {
  fetchData({ commit }): void {
    axios({
      url: `${domain}shop`,
    }).then(
      (response) => {
        const payload: RelevantAd[] = response && response.data;
        commit("addRelevantAds", payload);
      },
      (error) => {
        console.log(error);
        commit("addError");
      }
    );
  },
};
