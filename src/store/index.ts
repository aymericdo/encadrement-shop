import { RelevantAd } from "@/interfaces/relevantAd";
import axios from "axios";
import { createStore, StoreOptions } from "vuex";
import { RootState } from "./types";
import { relevantAd } from "./relevantAd/index";

const store: StoreOptions<RootState> = {
  state: {
    version: "",
  },
  modules: {
    relevantAd,
  },
};

export default createStore(store);
