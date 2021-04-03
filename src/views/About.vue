<template>
  <div class="about">
    <Menu></Menu>
    <h1>This is an about page</h1>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Menu from "@/components/menu/Menu.vue";

@Options({
  components: {
    Menu,
  },
})
export default class About extends Vue {}
</script>
