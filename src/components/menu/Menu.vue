<template>
  <div id="menu" class="menu">
    <nav class="main-nav">
      <Burger
        :isBurgerActive="isPanelOpen"
        @togglingSidebar="togglingSidebar(true)"
      ></Burger>
    </nav>
    <Sidebar :isPanelOpen="isPanelOpen" @toggleClosing="togglingSidebar(false)">
      <ul class="sidebar-panel-nav">
        <li>
          <router-link to="/">Sélection d'annonces</router-link>
        </li>
        <li>
          <a class="encadrement-redirect" href="https://encadrement-loyers.fr"
            >Encadrement</a
          >
        </li>
      </ul>
    </Sidebar>
  </div>
</template>

<script lang="ts" setup>
  import Burger from "@/components/menu/Burger.vue";
  import Sidebar from "@/components/menu/Sidebar.vue";
  import { ref } from "vue";

  const isPanelOpen = ref(false);

  const togglingSidebar = (isOpen: boolean) => {
    isPanelOpen.value = isOpen;
  }
</script>

<style scoped lang="scss">
@use "@/assets/scss/variables.scss" as *;

.slide-enter-active,
.slide-leave-active {
  transition: transform 200ms ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  transition: all 150ms ease-in 0s;
}

.main-nav {
  display: flex;
  padding: 0.5rem 0.8rem;
}

ul.sidebar-panel-nav {
  padding-left: 0;
  list-style-type: none;
}

ul.sidebar-panel-nav > li {
  display: flex;
  flex-direction: column;
  padding: 0.5em 0;
}

ul.sidebar-panel-nav > li > .annexe-list {
  display: flex;
  flex-direction: column;
  padding-left: 1.25em;
}

ul.sidebar-panel-nav > li > .annexe-list > a {
  padding-top: 0.25em;
}

ul.sidebar-panel-nav > li a {
  position: relative;
  color: $deepblack;
  text-decoration: none;
  font-size: 1.5rem;
  display: flex;
  flex: 1;
  cursor: pointer;
  font-weight: 500;
}

ul.sidebar-panel-nav > li a:not(.router-link-active)::after {
  position: absolute;
  bottom: -2px;
  content: "";
  width: 100%;
  height: 2px;
  border-radius: 10px;
  background: $deepblack;
  transition: all 200ms ease;
  transition-property: opacity, transform;
  opacity: 0;
  transform: translateX(-100%);
}

ul.sidebar-panel-nav > li a:not(.router-link-active):hover::after {
  transform: translateX(0%);
  opacity: 1;
  transition: all 150ms ease-in 0s;
  transition-property: opacity, transform;
}

ul.sidebar-panel-nav
  > li
  a.encadrement-redirect:not(.router-link-active) {
  text-shadow: 1px 1px $yellow;
}

ul.sidebar-panel-nav
  > li
  a.encadrement-redirect:not(.router-link-active):hover {
  text-shadow: 2px 2px $yellow;
}

ul.sidebar-panel-nav > li.-selected > a:not(.router-link-active)::after {
  transform: translateX(0%);
  opacity: 1;
  transition: all 150ms ease-in 0s;
  transition-property: opacity, transform;
}

ul.sidebar-panel-nav > li a.router-link-active {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
