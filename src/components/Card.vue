<template>
  <div
    class="content-card"
    :class="{ loading: isLoading }"
    v-if="getUrl(ad?.website, ad?.id, ad?.url)"
  >
    <div class="content" @click="redirectTo(ad)">
      <div class="specs">
        <div class="burry-disclaimer" v-if="isFromMap && ad?.blurry">
          La localisation par coordonnées de cette annonce est imprécise.
        </div>
        <div v-if="ad?.roomCount">
          {{ ad?.roomCount }} pièce{{ ad?.roomCount > 1 ? "s" : "" }}
        </div>
        <div v-if="ad?.surface">{{ ad?.surface }}m²</div>
        <div class="location">
          <span class="city">{{ ad?.city }}</span> - {{ ad?.district }}
        </div>
        <div>{{ ad?.price }}€</div>
        <div v-if="ad?.exceeding" class="exceeding">+{{ ad?.exceeding }}€</div>
        <div class="space"></div>
        <div class="date">{{ getDisplayableDate(ad?.createdAt) }}</div>
      </div>
      <img
        class="image"
        :src="require(`@/assets/images/${ad?.website}-img.png`)"
        :alt="ad?.website"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RelevantAd } from "@/store/modules/relevantAd/interfaces";

export default defineComponent({
  name: "Card",
  props: {
    ad: { type: Object as () => RelevantAd },
    isLoading: { type: Boolean },
    isFromMap: { type: Boolean, default: false },
  },
  setup() {
    const getDisplayableDate = (date?: string): string => {
      if (!date) return "";
      const d = new Date(date);

      const todayDate = new Date();
      const todayDateFormatted = todayDate.toLocaleDateString();
      const yesterdayDate = new Date();
      yesterdayDate.setDate(todayDate.getDate() - 1);
      const yesterdayDateFormatted = yesterdayDate.toLocaleDateString();
      const dayBeforeYesterdayDate = new Date();
      dayBeforeYesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const dayBeforeYesterdayDateFormatted =
        yesterdayDate.toLocaleDateString();

      const dateFormat = d.toLocaleDateString();
      const timeFormat = d.toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      });

      return `Vu ${
        dateFormat === todayDateFormatted
          ? "aujourd'hui"
          : dateFormat === yesterdayDateFormatted
          ? "hier"
          : dateFormat === dayBeforeYesterdayDateFormatted
          ? "avant-hier"
          : "le " + dateFormat
      } à ${timeFormat}`;
    };

    const getUrl = (website?: string, id?: string, url?: string): string => {
      if (!id || !website) return "";

      if (url) {
        return url;
      }

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
    };

    const redirectTo = (ad?: RelevantAd): void => {
      if (!ad) return;
      window.open(getUrl(ad.website, ad.id, ad.url), "_blank");
    };

    return {
      getUrl,
      redirectTo,
      getDisplayableDate,
    };
  },
});
</script>

<style scoped lang="scss">
.content-card {
  height: 100%;
  width: 100%;
  min-width: 250px;
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
  background-color: white;
}

.content:hover {
  box-shadow: 0px 0px 10px #050505;
}

.specs {
  height: 100%;
  width: 100%;
  font-weight: 500;
  padding: 1em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  & > .exceeding {
    color: red;
  }

  & > .space {
    flex: 1;
  }

  & > .burry-disclaimer {
    font-style: italic;
  }

  & > .location > .city {
    text-transform: capitalize;
  }

  & > .date {
    display: flex;
    justify-content: flex-end;
  }

  > div:not(:last-child) {
    margin-bottom: 0.625em;
  }
}

.image {
  position: absolute;
  width: 100%;
  opacity: 0.2;
  padding: 2em;
  box-sizing: border-box;
}
</style>
