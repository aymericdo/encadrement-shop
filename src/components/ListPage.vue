<template>
  <div class="list-page">
    <div class="card" v-for="ad of relevantAds" :key="ad.id">
      {{ ad.website }}
    </div>
  </div>
</template>

<script lang="ts">
import { RelevantAd } from "@/interfaces/relevantAd";
import { Options, Vue } from "vue-class-component";
import { Action, Getter } from "vuex-class";
const namespace = "relevantAd";

@Options({})
export default class ListPage extends Vue {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  @Action("fetchData", { namespace }) fetchData: any;
  @Getter("getRelevantAds", { namespace }) relevantAds!: RelevantAd[];

  mounted(): void {
    this.fetchData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
