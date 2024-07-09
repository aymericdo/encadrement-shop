<template>
  <div class="about">
    <Menu></Menu>
    <div class="content">
      <div class="section">
        <p>
          Et quand le soir, dans vos belles maisons, vous allez embrasser vos petits enfants avec votre bonne conscience, au regard de Dieu vous avez probablement plus de sang sur vos mains d’inconscients que n’en aura jamais le désespéré qui a pris les armes pour essayer de sortir de son désespoir.
        </p>
        <span class="sign">Abbé Pierre, discours, 1984</span>
      </div>
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
  width: 100%;
  height: 90vh;

  .section {
    display: flex;
    flex-direction: column;
    width: 60%;
  }

  p {
    display: flex;
    align-self: start;
    text-align: justify;
    font-style: italic;
  }
}

.sign {
  margin-top: 2em;
  align-self: flex-end;
}

@media screen and (max-width: $mobileSize) {
  .content .section {
    width: 90%;
  }
}
</style>
