<template>
  <div
    class="content-card"
    :class="{ loading: isLoading }"
    v-if="!!ad?.url?.length"
  >
    <a :href="ad.url" target="_blank">
      <div class="content">
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
        <img class="image" :src="imagePath" :alt="ad?.website" />
      </div>
    </a>
  </div>
</template>

<script lang="ts" setup>
  import { toRefs } from "vue";
  import { RelevantAd } from "@/store/modules/relevantAd/interfaces";

  const glob = import.meta.glob('@/assets/images/*-img.png', { eager: true })
  const images = Object.entries(glob).map(([, value]) => (value as any).default)

  const props = defineProps({
    ad: {
      type: Object as () => RelevantAd,
      required: true,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isFromMap: {
      type: Boolean,
      default: false,
    },
  });

  const {
    ad,
    isLoading,
    isFromMap,
  } = toRefs(props);

  const website: string = ad.value?.website || ''
  const imagePath = images.find((image) => image.includes(website)) || images.find((image) => image.includes('default-img'))
  console.log(images)

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
</script>

<style scoped lang="scss">
.content-card {
  height: 100%;
  width: 100%;
  min-width: 250px;

  a {
    color: #050505;
  }
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
