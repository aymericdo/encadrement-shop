<template>
  <div class="home">
    <Menu></Menu>
    <div class="title">
      <h3>
        La sélection d'annonces
        <span v-if="isDarkMode" class="non">non </span>conformes de l'extension
        <a class="link" href="https://encadrement-loyers.fr">Encadrement</a>
      </h3>
    </div>
    <div class="menu-filters">
      <Dropfilters
        class="dropfilters"
        @onSubmit="changeFilters($event)"
        @onReset="changeFilters(null)"
        :options="filtersOptions"
        :filtersCount="filtersCount"
      ></Dropfilters>
      <div class="dark-toggle">
        <Toggle
          @change="handleDarkToggle"
          :value="isDarkMode"
          :offLabel="'Conforme'"
          :onLabel="'Non conforme'"
        />
      </div>
      <div class="map-toggle">
        <Toggle
          @change="handleMapToggle"
          :value="isMapMode"
          :offLabel="'Liste'"
          :onLabel="'Carte'"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watchEffect } from "vue";
import Menu from "@/components/menu/Menu.vue";
import Dropfilters from "@/components/Dropfilters.vue";
import { initialFilters } from "@/store/modules/relevantAd/state";
import { RelevantAdActionTypes } from "@/store/modules/relevantAd/action-types";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Toggle from "@vueform/toggle";
import router from "@/router";

const namespace = "relevantAd";

import "@vueform/toggle/themes/default.css";

export default defineComponent({
  name: "Home",
  components: {
    Menu,
    Dropfilters,
    Toggle,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

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
      if (Object.keys(route.query).length > 0) {
        store.dispatch(
          `${namespace}/${RelevantAdActionTypes.SetDefaultFilter}`,
          route.query
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
        furnishedValue: string;
        cityValue: string;
        isHouseValue: string;
        districtValues: never[];
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

    return {
      isMapMode,
      isDarkMode,
      filtersOptions,
      filtersCount,
      changeFilters,
      handleDarkToggle,
      handleMapToggle,
    };
  },
});
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.title > h3 {
  margin-top: 1.5rem;
  margin-left: 3.125rem;

  & > .non {
    color: red;
  }

  & > .link {
    text-decoration: none;
    color: inherit;
    text-shadow: 1px 1px $yellow;
  }

  & > .link:hover {
    text-shadow: 2px 2px $yellow;
  }
}

.menu-filters {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .dropfilters {
    margin-left: 3.125rem;
    max-width: 150px;
  }

  .map-toggle,
  .dark-toggle {
    padding: 1rem 0.625rem;

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
