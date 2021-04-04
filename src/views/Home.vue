<template>
  <div class="home">
    <Menu></Menu>
    <ListPage />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Menu from "@/components/menu/Menu.vue";
import ListPage from "@/components/ListPage.vue";

export default defineComponent({
  name: "Home",
  components: {
    Menu,
    ListPage,
  },
});
</script>
