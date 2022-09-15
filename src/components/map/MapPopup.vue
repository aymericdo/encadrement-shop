<template>
  <l-popup>
    <Card :ad="ad" :isFromMap="true"></Card>
  </l-popup>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LPopup } from "@vue-leaflet/vue-leaflet";
import { RelevantAd } from "@/store/modules/relevantAd/interfaces";
import Card from "@/components/Card.vue";

export default defineComponent({
  name: "MapPopup",
  components: {
    LPopup,
    Card,
  },
  props: {
    ad: { type: Object as () => RelevantAd },
  },
});
</script>

<style lang="scss">
.leaflet-popup-content {
  margin: 0 !important;
}
</style>
