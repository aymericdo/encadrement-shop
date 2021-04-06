<template>
  <div class="home">
    <Menu></Menu>
    <div class="title">
      <h3>
        La sélection d'annonces conformes de l'extension
        <a class="link" href="https://encadrement-loyers.fr">Encadrement</a>
      </h3>
    </div>
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

<style scoped lang="scss">
.title > h3 {
  margin-top: 1.5rem;
  margin-left: 3.125rem;

  & > .link {
    text-decoration: none;
    color: inherit;
    text-shadow: 1px 1px $yellow;
  }

  & > .link:hover {
    text-shadow: 2px 2px $yellow;
  }
}
</style>
