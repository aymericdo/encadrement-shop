<template>
  <div class="about">
    <Menu></Menu>
    <div class="content">
      <h1>À propos</h1>
      <p>
        On s'est dit qu'on n'allait pas s'arrêter en si bon chemin, alors pour
        vous (et vos yeux ébahis), une page ENTIÈRE d'annonces complètement
        vérifiées par nos soins ! :D
      </p>
      <p>
        Comme ça, plus besoin de tergiverser (ni de justifier), ces annonces
        sont de fait, légales.
      </p>
      <span class="sign">Aymeric et Thomas</span>
    </div>
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

<style scoped lang="scss">
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 10em;

  & > p {
    display: flex;
    align-self: start;
    text-align: justify;
  }
}

.sign {
  margin-top: 2em;
  align-self: flex-end;
}

@media screen and (max-width: $mobileSize) {
  .content {
    padding: 0 0.625em;
  }
}
</style>
