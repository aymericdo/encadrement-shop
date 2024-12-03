<template>
  <div class="about">
    <Menu></Menu>
    <div class="content">
      <div class="section"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Menu from "@/components/menu/Menu.vue";
</script>

<style scoped lang="scss">
@use "@/assets/scss/variables.scss" as *;

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
