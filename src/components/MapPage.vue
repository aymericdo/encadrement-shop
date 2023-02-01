<template>
  <div class="map-page" :class="{ '-dark': isDarkMode, '-loading': isLoading }">
    <l-map ref="mapRef" class="l-map" :zoom="zoom" :center="center">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        :max-zoom="15"
      />
      <l-geo-json
        v-for="geojson of geojsons"
        :key="geojson.id"
        :geojson="geojson.data"
      />
      <template v-for="ad of relevantAds" :key="ad._id">
        <l-marker
          v-if="getPosAd(ad)"
          :lat-lng="getPosAd(ad)"
          :draggable="false"
        >
          <MapPopup :ad="ad"></MapPopup>
        </l-marker>
      </template>
    </l-map>
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
import {
  computed,
  defineComponent,
  onMounted,
  Ref,
  ref,
  watchEffect,
} from "vue";
import { LMap, LGeoJson, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import BounceLoader from "vue-spinner/src/BounceLoader.vue";
import MapPopup from "@/components/map/MapPopup.vue";
import { useStore } from "vuex";
import "leaflet/dist/leaflet.css";
import { RelevantAd } from "@/store/modules/relevantAd/interfaces";
import { domain } from "@/helper/config";
import axios from "axios";

const namespace = "relevantAd";

const CENTERS: { [city: string]: number[] } = {
  all: [46.2513662, 4.755835],
  paris: [48.866667, 2.333333],
  lille: [50.62925, 3.057256],
  plaineCommune: [48.9246404, 2.3625964],
  estEnsemble: [48.86415, 2.44322],
  lyon: [45.7578137, 4.8320114],
  montpellier: [43.6112422, 3.8767337],
  bordeaux: [44.841225, -0.5800364],
};

const FRANCE_ZOOM = 6;
const CITY_ZOOM = 12;

export default defineComponent({
  name: "MapPage",
  components: {
    BounceLoader,
    LMap,
    LTileLayer,
    LGeoJson,
    LMarker,
    MapPopup,
  },
  setup() {
    const store = useStore();
    const geojsons: Ref<{ id: number; data: unknown; city: string }[]> = ref(
      []
    );

    const mapRef = ref(null);

    const center: Ref<number[]> = ref(CENTERS["all"]);
    const zoom: Ref<number> = ref(FRANCE_ZOOM);

    const page = computed(() => store.getters[`${namespace}/getCurrentPage`]);

    const isLoading = computed(
      () => store.getters[`${namespace}/getIsLoading`]
    );

    const isDarkMode = computed(
      () => store.getters[`${namespace}/getIsDarkMode`]
    );

    const relevantAds = computed(
      () => store.getters[`${namespace}/getRelevantAds`]
    );

    const filtersOptions = computed(
      () => store.getters[`${namespace}/getCurrentFilters`]
    );

    const getPosAd = (ad: RelevantAd) => {
      return ad.latitude && ad.latitude ? [ad.latitude, ad.longitude] : null;
    };

    watchEffect(
      () => {
        if (
          filtersOptions.value &&
          mapRef.value &&
          (mapRef.value as any).ready
        ) {
          const opt = { ...filtersOptions.value };
          center.value = CENTERS[opt.cityValue as string];
          setTimeout(() => {
            zoom.value =
              (opt.cityValue as string) === "all" ? FRANCE_ZOOM : CITY_ZOOM;
          }, 250);
        }
      },
      {
        flush: "post",
      }
    );

    onMounted(() => {
      const fileList = [
        "quartier_paris",
        "quartier_lille",
        "quartier_plaine-commune",
        "quartier_est-ensemble",
        "quartier_lyon",
        "quartier_montpellier",
        "quartier_bordeaux",
      ];
      fileList.forEach(async (file: string, index: number) => {
        const response = await axios({
          url: `${domain}/${file}.geojson`,
        });
        geojsons.value.push({
          id: index,
          data: response.data,
          city: file.split("_")[1],
        });
      });
    });

    return {
      store,
      page,
      relevantAds,
      isLoading,
      isDarkMode,
      zoom,
      center,
      geojsons,
      mapRef,
      getPosAd,
    };
  },
});
</script>

<style scoped lang="scss">
.l-map {
  height: 100%;
}

.map-page {
  display: flex;
  margin-top: 1em;
  flex: 1;
  padding: 2rem;

  &.-dark {
    background-color: #050505;
    border-radius: 5px;

    .card {
      background-color: #050505;

      ::v-deep(.content) {
        box-shadow: 0px 0px 20px white;

        &:hover {
          box-shadow: 0px 0px 10px white;
        }
      }
    }
  }

  &.-loading .l-map {
    opacity: 0.5;
  }
}

.center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 400;
}

@media screen and (max-width: $mobileSize) {
  .map-page {
    padding: 0;
  }
}
</style>
