import { RelevantAd } from "@/store/modules/relevantAd/interfaces";

export interface RelevantAdState {
  relevantAdList: RelevantAd[];
  loading: boolean;
  error: boolean;
  currentPage: number;
  totalPages: number | null;
}
