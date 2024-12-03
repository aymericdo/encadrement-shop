<template>
  <div class="home">
    <Menu></Menu>
    <div class="title ml-12">
      <h3>
        La sélection d'annonces
        <span v-if="isDarkMode" class="non">non </span>conformes de l'extension
        <a class="link" href="https://encadrement-loyers.fr">Encadrement</a>
      </h3>
    </div>
    <div v-if="isMounted" class="menu-filters flex space-x-4 flex-wrap items-center mt-2 ml-12">
      <Dropfilters
        :options="filtersOptions"
        :filtersCount="filtersCount"
        @on-submit="changeFilters($event)"
        @on-reset="changeFilters(null)"
      />
      <div class="toggles flex space-x-4 flex-wrap justify-left">
        <div class="dark-toggle">
          <Toggle
            @change="handleDarkToggle"
            :value="isDarkMode"
            offLabel="Conforme"
            onLabel="Non conforme"
          />
        </div>
        <div class="map-toggle">
          <Toggle
            @change="handleMapToggle"
            :value="isMapMode"
            offLabel="Liste"
            onLabel="Carte"
          />
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, watchEffect } from "vue";
  import Menu from "@/components/menu/Menu.vue";
  import Dropfilters from "@/components/DropfiltersItem.vue";
  import { initialFilters } from "@/store/modules/relevantAd/state";
  import { RelevantAdActionTypes } from "@/store/modules/relevantAd/action-types";
  import { useStore } from "vuex";
  import { useRoute } from "vue-router";
  import Toggle from '@vueform/toggle'
  import router from "@/router";
  
  import "@vueform/toggle/themes/default.css";

  const namespace = "relevantAd";

  const store = useStore();
  const route = useRoute();

  const isMounted = ref(false);

  const isDarkMode = computed(
    () => store.getters[`relevantAd/getIsDarkMode`]
  );

  const isMapMode = computed(() => store.getters[`relevantAd/getIsMapMode`]);

  const filtersOptions = computed(
    () => store.getters[`${namespace}/getCurrentFilters`]
  );

  const filtersCount = computed(
    () => store.getters[`${namespace}/getFiltersCount`]
  );

  watchEffect(
    () => {
      const opt = { ...filtersOptions.value };

      const isDark = !opt.isLegal;
      delete opt.isLegal;

      if (isDark) {
        router.push({
          name: isMapMode.value ? "DarkMap" : "DarkList",
          query: opt,
        });
      } else {
        router.push({
          name: isMapMode.value ? "HomeMap" : "HomeList",
          query: opt,
        });
      }
    },
    {
      flush: "post",
    }
  );

  onMounted(() => {
    store.dispatch(`${namespace}/${RelevantAdActionTypes.FetchingCities}`);

    if (Object.keys(route.query).length > 0) {
      store.dispatch(
        `${namespace}/${RelevantAdActionTypes.SetDefaultFilter}`,
        Object.keys(route.query).reduce((prev, key) => {
          if (['exceedingValue', 'surfaceValue', 'roomValue', 'priceValue'].includes(key)) {
            prev[key] = (route.query[key] as string[]).map((val: string) => +val);
          } else {
            prev[key] = route.query[key] as string;
          }

          return prev;
        }, {} as { [key: string]: (number[] | string) }),
      );
    }

    if (route.name?.toString().includes("Dark")) {
      store.dispatch(`${namespace}/${RelevantAdActionTypes.SetDarkMode}`);
    } else {
      store.dispatch(`${namespace}/${RelevantAdActionTypes.SetLegalMode}`);
    }

    if (route.name === "HomeMap" || route.name === "DarkMap") {
      store.dispatch(
        `${namespace}/${RelevantAdActionTypes.SetMapMode}`,
        true
      );
    }

    isMounted.value = true;
  });

  const handleDarkToggle = (event: boolean) => {
    if (event) {
      store.dispatch(`${namespace}/${RelevantAdActionTypes.SetDarkMode}`);
    } else {
      store.dispatch(`${namespace}/${RelevantAdActionTypes.SetLegalMode}`);
    }
  };

  const handleMapToggle = (event: boolean) => {
    store.dispatch(`${namespace}/${RelevantAdActionTypes.SetMapMode}`, event);
  };

  const changeFilters = (
    filtersOptions: {
      surfaceValue: number[];
      roomValue: number[];
      priceValue: number[];
      exceedingValue: number[];
      furnishedValue: string;
      cityValue: string;
      isHouseValue: string;
    } | null
  ) => {
    if (filtersOptions) {
      store.dispatch(`${namespace}/${RelevantAdActionTypes.SetNewFilters}`, {
        filters: {
          ...filtersOptions,
          isLegal: !isDarkMode.value,
        },
      });
    } else {
      store.dispatch(`${namespace}/${RelevantAdActionTypes.SetNewFilters}`, {
        filters: initialFilters,
      });
    }
  };
</script>

<style scoped lang="scss">
@use "@/assets/scss/variables.scss" as *;

.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.title > h3 {
  margin-top: 1.5rem;

  & > .non {
    font-weight: 500;
    color: red;
  }

  & > .link {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    text-shadow: 1px 1px $yellow;
  }

  & > .link:hover {
    text-shadow: 2px 2px $yellow;
  }
}

.menu-filters {
  .map-toggle,
  .dark-toggle {
    ::v-deep(.toggle-container) {
      &:focus {
        box-shadow: 0 0 0 var(--toggle-ring-width, 3px)
          var(--toggle-ring-color, rgba($yellow, 0.188));
      }
    }

    ::v-deep(.toggle) {
      font-weight: 500;
      border-color: black;

      &.toggle-off {
        background: white;

        .toggle-handle-off {
          background: $yellow;
        }
      }
    }
  }

  .map-toggle {
    ::v-deep(.toggle) {
      padding: 0 2rem 0 1.25rem;

      &.toggle-on {
        background: $yellow;
      }
    }
  }

  .dark-toggle {
    ::v-deep(.toggle) {
      padding: 0 5rem 0 1.25rem;
      &.toggle-on {
        background: red;
      }
    }
  }
}
</style>
