<template>
  <div class="sidebar">
    <div
      class="sidebar-backdrop"
      @click="closeSidebarPanel"
      v-if="isPanelOpen"
    ></div>
    <transition name="slide">
      <div v-if="isPanelOpen" class="sidebar-panel">
        <Burger
          class="sidebar-burger"
          :isBurgerActive="isPanelOpen"
          :isFixed="false"
          @togglingSidebar="closeSidebarPanel"
          ><span></span
        ></Burger>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
  import Burger from "@/components/menu/Burger.vue";
  import { toRefs } from "vue";

  const props = defineProps({
    isPanelOpen: {
      type: Boolean,
      default: false,
    },
  });

  const {
    isPanelOpen,
  } = toRefs(props);

  const emits = defineEmits([
    'toggleClosing',
  ]);

  const closeSidebarPanel = () => {
    emits("toggleClosing", false);
  }
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 200ms ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  transition: all 150ms ease-in 0s;
}

.sidebar-backdrop {
  background-color: rgba(19, 15, 64, 0.4);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 1000;
}

.sidebar-burger {
  top: 1em;
  right: 1em;
}

.sidebar-panel {
  overflow-y: auto;
  background-color: white;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1005;
  padding: 3rem 20px 2rem 20px;
  width: 300px;
}
</style>
