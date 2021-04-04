<template>
  <div class="about">
    <Menu></Menu>
    <h1>This is an about page</h1>
  </div>
</template>

<script lang="ts">
import Menu from "@/components/menu/Menu.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  components: {
    Menu,
  },
});
</script>
