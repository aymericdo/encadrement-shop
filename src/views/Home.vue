<template>
  <div class="home">
    <Menu></Menu>
    <ListPage />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Menu from "@/components/menu/Menu.vue";
import ListPage from "@/components/ListPage.vue";

@Options({
  components: {
    Menu,
    ListPage,
  },
})
export default class Home extends Vue {}
</script>
