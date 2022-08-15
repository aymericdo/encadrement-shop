<template>
  <Dropfilters
    class="dropfilters"
    @onSubmit="changeFilters($event)"
    @onReset="changeFilters(null)"
    :options="filtersOptions"
    :filtersCount="filtersCount"
  ></Dropfilters>
  <div class="list-page" :class="{ '-dark': isDarkMode }">
    <template v-for="ad of relevantAds" :key="ad._id">
      <div
        class="card"
        :class="{ loading: isLoading }"
        v-if="getUrl(ad.website, ad.id, ad.url)"
      >
        <div class="sub-card">
          <div class="content" @click="redirectTo(ad)">
            <div class="specs">
              <div v-if="ad.roomCount">
                {{ ad.roomCount }} pièce{{ ad.roomCount > 1 ? "s" : "" }}
              </div>
              <div v-if="ad.surface">{{ ad.surface }}m²</div>
              <div class="location">
                <span class="city">{{ ad.city }}</span> - {{ ad.district }}
              </div>
              <div>{{ ad.price }}€</div>
              <div class="space"></div>
              <div class="date">{{ getDisplayableDate(ad.createdAt) }}</div>
            </div>
            <img
              class="image"
              :src="require(`@/assets/images/${ad.website}-img.png`)"
              :alt="ad.website"
            />
          </div>
        </div>
      </div>
    </template>
    <div class="center">
      <bounce-loader
        class="spinner"
        :loading="isLoading"
        color="#fdcd56"
        :size="'100px'"
      ></bounce-loader>
    </div>
  </div>
</template>

<script lang="ts">
import Dropfilters from "@/components/Dropfilters.vue";
import { RelevantAd } from "@/store/modules/relevantAd/interfaces";
import { RelevantAdActionTypes } from "@/store/modules/relevantAd/action-types";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  watchEffect,
} from "vue";
import BounceLoader from 'vue-spinner/src/BounceLoader.vue';
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { initialFilters } from "@/store/modules/relevantAd/state";
import router from "@/router";

const namespace = "relevantAd";

export default defineComponent({
  name: "ListPage",
  components: {
    BounceLoader,
    Dropfilters,
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    const page = computed(() => store.getters[`${namespace}/getCurrentPage`]);
    const filtersOptions = computed(
      () => store.getters[`${namespace}/getCurrentFilters`]
    );
    const totalPages = computed(
      () => store.getters[`${namespace}/getTotalPages`]
    );

    const isLoading = computed(
      () => store.getters[`${namespace}/getIsLoading`]
    );

    const isDarkMode = computed(
      () => store.getters[`${namespace}/getIsDarkMode`]
    );

    const filtersCount = computed(
      () => store.getters[`${namespace}/getFiltersCount`]
    );

    const relevantAds = computed(
      () => store.getters[`${namespace}/getRelevantAds`]
    );

    const handleScroll = () => {
      if (
        !isLoading.value &&
        page.value < totalPages.value &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      ) {
        store.dispatch(
          `${namespace}/${RelevantAdActionTypes.FetchRelevantAdsWithNewPage}`,
          {
            page: page.value,
            filters: filtersOptions.value,
          }
        );
      }
    };

    watchEffect(
      () => {
        if (filtersOptions.value) {
          const opt = filtersOptions.value;
          delete opt.isLegal;
          router.push({ query: opt });
        }
      },
      {
        flush: "post",
      }
    );

    onMounted(() => {
      if (Object.keys(route.query).length > 0) {
        store.dispatch(
          `${namespace}/${RelevantAdActionTypes.SetDefaultFilter}`,
          route.query
        );
      }

      if (route.name === "Dark") {
        store.dispatch(`${namespace}/${RelevantAdActionTypes.SetDarkMode}`);
      }

      store.dispatch(
        `${namespace}/${RelevantAdActionTypes.FetchRelevantAdsWithNewPage}`,
        {
          page: page.value,
          filters: filtersOptions.value,
        }
      );
      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      store,
      page,
      relevantAds,
      isLoading,
      filtersCount,
      totalPages,
      filtersOptions,
      isDarkMode,
    };
  },
  methods: {
    changeFilters(filtersOptions?: {
      surfaceValue: number[];
      roomValue: number[];
      priceValue: number[];
      furnishedValue: string;
      cityValue: string;
      isHouseValue: string;
      districtValues: never[];
    }) {
      if (filtersOptions) {
        this.store.dispatch(
          `${namespace}/${RelevantAdActionTypes.FetchRelevantAdsWithNewFilters}`,
          {
            page: 0,
            filters: {
              ...filtersOptions,
              isLegal: !this.isDarkMode,
            },
          }
        );
      } else {
        this.store.dispatch(
          `${namespace}/${RelevantAdActionTypes.FetchRelevantAdsWithNewFilters}`,
          {
            page: 0,
            filters: initialFilters,
          }
        );
      }
    },
    getDisplayableDate(date: string): string {
      const d = new Date(date);

      const todayDate = new Date();
      const todayDateFormatted = todayDate.toLocaleDateString();
      const yesterdayDate = new Date();
      yesterdayDate.setDate(todayDate.getDate() - 1);
      const yesterdayDateFormatted = yesterdayDate.toLocaleDateString();
      const dayBeforeYesterdayDate = new Date();
      dayBeforeYesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const dayBeforeYesterdayDateFormatted = yesterdayDate.toLocaleDateString();

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
    },
    redirectTo(ad: RelevantAd): void {
      window.open(this.getUrl(ad.website, ad.id, ad.url), "_blank");
    },
    getUrl(website: string, id: string, url?: string): string {
      if (!id) return "";

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
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list-page {
  display: grid;
  margin-top: 1em;
  grid-template-columns: repeat(3, 2fr);

  &.-dark {
    background-color: #050505;
    border-radius: 5px;

    .content {
      background-color: white;
      box-shadow: 0px 0px 20px white;
    }
  }
}

.dropfilters {
  margin-left: 3.125rem;
  max-width: 150px;
}

.center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card {
  padding-bottom: 100%;
  position: relative;
}

.card.loading {
  opacity: 0.5;
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
  height: 100%;
  width: 100%;
  font-weight: 500;
  padding: 1em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  & > .space {
    flex: 1;
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

@media screen and (max-width: $mobileSize) {
  .list-page {
    grid-template-columns: repeat(1, 2fr);
  }
}
</style>
