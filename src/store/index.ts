import { createStore, StoreOptions } from "vuex";
import { RootState } from "./types";
import { relevantAd } from "./modules/relevantAd/state";

const store: StoreOptions<RootState> = {
  state: {
    version: "",
  },
  modules: {
    relevantAd,
  },
};

export default createStore(store);
