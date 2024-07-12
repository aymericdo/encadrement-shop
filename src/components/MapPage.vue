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
import { computed, defineComponent, Ref, ref, watchEffect } from "vue";
import { LMap, LGeoJson, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import BounceLoader from "vue-spinner/src/BounceLoader.vue";
import MapPopup from "@/components/map/MapPopup.vue";
import { useStore } from "vuex";
import "leaflet/dist/leaflet.css";
import { RelevantAd } from "@/store/modules/relevantAd/interfaces";
import { domain } from "@/helper/config";
import axios from "axios";

const namespace = "relevantAd";

const FRANCE_ZOOM = 6;
const FRANCE_POSITION = [46.2513662, 4.755835];
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

    const center: Ref<number[]> = ref(FRANCE_POSITION);
    const zoom: Ref<number> = ref(FRANCE_ZOOM);

    const page = computed(() => store.getters[`${namespace}/getCurrentPage`]);

    const isLoading = computed(
      () => store.getters[`${namespace}/getIsLoading`]
    );

    const mainCityList = computed(
      () => store.getters[`relevantAd/getMainCities`]
    );

    const coordinatesByMainCity = computed(
      () => store.getters[`relevantAd/getCoordinatesByMainCity`]
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
          (mapRef.value as typeof LMap).ready
        ) {
          const opt = { ...filtersOptions.value };
          const globalView = (opt.cityValue as string) === "all";
          center.value = globalView
            ? FRANCE_POSITION
            : coordinatesByMainCity.value[opt.cityValue as string];
          setTimeout(() => {
            zoom.value = globalView ? FRANCE_ZOOM : CITY_ZOOM;
          }, 250);
        }
      },
      {
        flush: "post",
      }
    );

    watchEffect(
      () => {
        if (mainCityList.value) {
          const currentMainCityList = [...mainCityList.value];

          currentMainCityList.forEach(
            async (mainCity: string, index: number) => {
              const response = await axios({
                url: `${domain}districts/geojson/${mainCity}`,
              });
              geojsons.value.push({
                id: index,
                data: response.data,
                city: mainCity,
              });
            }
          );
        }
      },
      {
        flush: "post",
      }
    );

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
  border-radius: 8px;
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
