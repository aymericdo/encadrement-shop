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
    </div>
    <ListPage />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watchEffect } from "vue";
import Menu from "@/components/menu/Menu.vue";
import ListPage from "@/components/ListPage.vue";
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
    ListPage,
    Dropfilters,
    Toggle,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const isDarkMode = computed(
      () => store.getters[`relevantAd/getIsDarkMode`]
    );

    const filtersOptions = computed(
      () => store.getters[`${namespace}/getCurrentFilters`]
    );

    const filtersCount = computed(
      () => store.getters[`${namespace}/getFiltersCount`]
    );

    watchEffect(
      () => {
        if (filtersOptions.value) {
          const opt = { ...filtersOptions.value };

          const isDark = !opt.isLegal;
          delete opt.isLegal;

          router.push({ name: isDark ? "Dark" : "Home", query: opt });
        }
      },
      {
        flush: "post",
      }
    );

    onMounted(() => {
      if (route.name === "Dark") {
        store.dispatch(`${namespace}/${RelevantAdActionTypes.SetDarkMode}`);
      }
    });

    const handleDarkToggle = (event: boolean) => {
      if (event) {
        store.dispatch(`${namespace}/${RelevantAdActionTypes.SetDarkMode}`);
      } else {
        store.dispatch(`${namespace}/${RelevantAdActionTypes.SetLegalMode}`);
      }
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
        store.dispatch(
          `${namespace}/${RelevantAdActionTypes.FetchRelevantAdsWithNewFilters}`,
          {
            page: 0,
            filters: {
              ...filtersOptions,
              isLegal: !isDarkMode.value,
            },
          }
        );
      } else {
        store.dispatch(
          `${namespace}/${RelevantAdActionTypes.FetchRelevantAdsWithNewFilters}`,
          {
            page: 0,
            filters: initialFilters,
          }
        );
      }
    };

    return {
      isDarkMode,
      filtersOptions,
      filtersCount,
      changeFilters,
      handleDarkToggle,
    };
  },
});
</script>

<style scoped lang="scss">
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
  justify-content: start;
  align-items: center;

  .dropfilters {
    margin-left: 3.125rem;
    max-width: 150px;
  }

  .dark-toggle {
    padding: 1rem 0.625rem;

    ::v-deep(.toggle-container) {
      &:focus {
        box-shadow: 0 0 0 var(--toggle-ring-width, 3px)
          var(--toggle-ring-color, rgba($yellow, 0.188));
      }
    }

    ::v-deep(.toggle) {
      padding: 0 70px 0 20px;
      font-weight: 500;
      border-color: black;

      &.toggle-off {
        background: white;

        .toggle-handle-off {
          background: $yellow;
        }
      }

      &.toggle-on {
        background: red;
      }
    }
  }
}
</style>
