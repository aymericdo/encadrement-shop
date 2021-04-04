<template>
  <div class="list-page">
    <template v-for="ad of relevantAds" :key="ad.id">
      <div class="card" v-if="getUrl(ad.website, ad.id)">
        <div class="sub-card">
          <div class="content" @click="redirectTo(ad)">
            <div class="specs">
              <span
                >{{ ad.roomCount }} pièce{{ ad.roomCount > 1 ? "s" : "" }}</span
              >
            </div>
            <img
              class="image"
              :src="require(`@/assets/${ad.website}-img.png`)"
              :alt="ad.website"
            />
          </div>
        </div>
      </div>
    </template>
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

  redirectTo(ad: RelevantAd): void {
    window.open(this.getUrl(ad.website, ad.id), "_blank");
  }

  getUrl(website: string, id: string): string {
    if (!id) return "";

    switch (website) {
      case "pap": {
        return `https://www.pap.fr/annonces/${id}`;
      }
      case "leboncoin": {
        const regex = id.match(/\d+/g);
        const realId = regex && regex[0];
        return `https://www.leboncoin.fr/locations/${realId}.htm`;
      }
      case "seloger": {
        return `https://www.seloger.com/annonces/locations/appartement/ville/quartier/${id}.htm`;
      }
      case "lefigaro": {
        return `https://immobilier.lefigaro.fr/annonces/annonce-${id}.html`;
      }
      case "bienici": {
        return `https://www.bienici.com/annonce/location/paris-18e/appartement/1piece/${id}`;
      }
      case "bellesdemeures": {
        return `https://www.bellesdemeures.com/en/listings/rental/tt-1-tb-1-pl-48256/${id}`;
      }
      case "facebook": {
        return `https://www.facebook.com/marketplace/item/${id}`;
      }
      case "logicimmo": {
        return `https://www.logic-immo.com/detail-location-${id}.htm`;
      }

      default: {
        return "";
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-page {
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
}

.card {
  width: 33%;
  height: 0;
  padding-bottom: 33%;
  position: relative;
}

.sub-card {
  position: absolute;
  padding: 2em;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}

.content {
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 20px #050505;
  border-radius: 8px;
}

.content:hover {
  box-shadow: 0px 0px 10px #050505;
}

.specs {
  font-weight: 500;
}

.image {
  position: absolute;
  width: 100%;
  opacity: 0.2;
  padding: 2em;
  box-sizing: border-box;
}

@media screen and (max-width: 856px) {
  .card {
    width: 100%;
    padding-bottom: 100%;
  }
}
</style>
