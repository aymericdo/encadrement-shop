<template>
  <div class="p-4">
    <div ref="listPageRef" class="list-page" :class="{ '-dark': isDarkMode }">
      <template v-for="ad of relevantAds" :key="ad._id">
        <div class="card">
          <div class="sub-card">
            <Card :ad="ad" :isLoading="isLoading"></Card>
          </div>
        </div>
      </template>

      <div class="no-result" v-if="!relevantAds.length && !isLoading">
        No result
      </div>

      <div class="center">
        <bounce-loader
          class="spinner"
          :loading="isLoading"
          color="#fdcd56"
          :size="'100px'"
        ></bounce-loader>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { RelevantAdActionTypes } from "@/store/modules/relevantAd/action-types";
  import Card from "@/components/CardItem.vue";
  import {
    computed,
    onMounted,
    onUnmounted,
    Ref,
    ref,
  } from "vue";
  import BounceLoader from "vue-spinner/src/BounceLoader.vue";
  import { useStore } from "vuex";

  const namespace = "relevantAd";

  const store = useStore();
  const listPageRef: Ref<HTMLDivElement | null> = ref(null);

  const page = computed(() => store.getters[`${namespace}/getCurrentPage`]);
  const totalPages = computed(
    () => store.getters[`${namespace}/getTotalPages`]
  );

  const isLoading = computed(
    () => store.getters[`${namespace}/getIsLoading`]
  );

  const isDarkMode = computed(
    () => store.getters[`${namespace}/getIsDarkMode`]
  );

  const relevantAds = computed(
    () => store.getters[`${namespace}/getRelevantAds`]
  );

  const handleScroll = () => {
    if (
      !isLoading.value &&
      page.value + 1 < totalPages.value &&
      window.scrollY + window.outerHeight >=
        (listPageRef.value as HTMLDivElement).clientHeight
    ) {
      store.dispatch(`${namespace}/${RelevantAdActionTypes.SetNewPage}`, {
        page: page.value + 1,
      });
    }
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
</script>

<style scoped lang="scss">
@use "@/assets/scss/variables.scss" as *;

.list-page {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 2fr);
  padding: 5rem;

  .no-result {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.-dark {
    background-color: #050505;
    border-radius: 5px;
    .no-result {
      color: white;
    }

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

@media screen and (max-width: $mobileSize) {
  .list-page {
    grid-template-columns: repeat(1, 2fr);
    padding: 0;
  }
}
</style>
