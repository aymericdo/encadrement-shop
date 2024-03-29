<template>
  <div class="dropdown">
    <div class="overlay" v-if="isOpen" @click="onOpen"></div>
    <button @click="onOpen" :class="{ '-is-open': isOpen }">
      <span>{{ currentValueDisplay }}</span
      ><ArrowIcon
        class="arrow-icon"
        :class="{ '-is-open': isOpen }"
      ></ArrowIcon>
    </button>
    <transition name="slide-down">
      <div class="option-list" v-if="isOpen" ref="optionListRef">
        <div
          class="option"
          v-for="option in options"
          :class="{ '-selected': currentValue === option.value }"
          v-bind:key="option.value"
          @click="onSelect(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import { defineComponent, ref, watchEffect, onMounted, onUnmounted } from "vue";
export default defineComponent({
  name: "Dropdown",
  props: ["options", "currentValue"],
  setup(props) {
    const optionListRef = ref(null);
    const isOpen = ref(false);
    const currentValueDisplay = ref("");
    let scrollIntoViewTimeout = null;

    watchEffect(
      () => {
        if (!isOpen.value) {
          clearTimeout(scrollIntoViewTimeout);
        }

        if (optionListRef.value && isOpen) {
          scrollIntoViewTimeout = setTimeout(() => {
            optionListRef.value.scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline: "end",
            });
          }, 800);
        }
      },
      {
        flush: "post",
      }
    );

    onMounted(() => {
      currentValueDisplay.value = props.options.find(
        (opt) => opt.value === props.currentValue
      ).label;
    });

    onUnmounted(() => {
      clearTimeout(scrollIntoViewTimeout);
    });

    return {
      optionListRef,
      isOpen,
      currentValueDisplay,
    };
  },
  watch: {
    currentValue: function () {
      this.currentValueDisplay = this.options.find(
        (opt) => opt.value === this.currentValue
      ).label;
    },
  },
  methods: {
    onOpen: function () {
      this.isOpen = !this.isOpen;
    },
    onSelect: function (opt) {
      this.isOpen = false;
      this.$emit("onSelect", opt);
    },
  },
  components: {
    ArrowIcon,
  },
});
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
}

.dropdown > button {
  cursor: pointer;
  display: flex;
  position: relative;
  align-items: center;
  background-color: $yellow;
  font-weight: 600;
  height: 36px;
  width: 100%;
  font-size: 20px;
  padding: 6px 12px;
  border: solid transparent 1px;
  border-radius: 4px;
  transition: background-color ease 0.3s;
}

.dropdown > button.-is-open {
  z-index: 2;
}

.dropdown > button > span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  padding-right: 1em;
}

.arrow-icon {
  position: absolute;
  right: 14px;
  transition: transform ease 0.3s;
}

.arrow-icon.-is-open {
  transform: rotate(180deg);
}

.overlay {
  background: rgba(19, 15, 64, 0.4);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 2;
  overflow: hidden;
}

.option-list {
  position: absolute;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  top: 100%;
  margin-top: 4px;
  background-color: white;
  color: $deepblack;
  border-radius: 4px;
  border: 1px solid $deepblack;
  z-index: 1001;
}

.option {
  display: flex;
  min-height: 36px;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1em;
  font-weight: 400;
  cursor: pointer;
  transition: all ease 0.3s;
  transition-property: background-color, color;
  border-bottom: solid 1px $deepblack;

  &:last-child {
    border-bottom: none;
  }
}

.option.-selected,
.option:active {
  background-color: $yellow;
}

.option.-selected {
  font-weight: 500;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all ease 400ms;
  transition-property: opacity, transform;
}

@media (hover: hover) and (pointer: fine) {
  .dropdown > button:hover {
    box-shadow: 0 0 0 1px $deepblack;
  }

  .option:hover {
    background-color: $yellow;
  }
}
</style>
