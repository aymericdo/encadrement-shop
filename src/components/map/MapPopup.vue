<template>
  <l-popup>
    <Card :ad="ad" :isFromMap="true"></Card>
  </l-popup>
</template>

<script lang="ts" setup>
  import { toRefs } from "vue";
  import { LPopup } from "@vue-leaflet/vue-leaflet";
  import { RelevantAd } from "@/store/modules/relevantAd/interfaces";
  import Card from "@/components/CardItem.vue";

  const props = defineProps({
    ad: {
      type: Object as () => RelevantAd,
      required: true,
      default: null,
    },
  });

  const {
    ad,
  } = toRefs(props);
</script>

<style lang="scss" setup>
.leaflet-popup-content {
  margin: 0 !important;
}
</style>
