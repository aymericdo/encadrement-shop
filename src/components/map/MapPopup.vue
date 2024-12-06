<template>
  <Card :ad="ad" :isFromMap="true"></Card>
</template>

<script lang="ts" setup>
  import { toRefs } from "vue";
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
