<template>
  <div class="dropfilters">
    <button
      class="dropdown-btn"
      @click="onOpen()"
      :class="{ '-is-open': isOpen }"
    >
      <span>Filtres</span>
      <ArrowIcon class="arrow-icon" :class="{ '-is-open': isOpen }"></ArrowIcon>
    </button>
    <button
      class="mobile-back-btn"
      :class="{ '-is-open': isOpen }"
      @click="onOpen()"
    >
      <StrokeIcon></StrokeIcon>
    </button>
    <transition name="slide-down">
      <div class="option-list" v-if="isOpen">
        <div class="row">
          <span class="label">Ville</span>
          <span>
            <Dropdown
              :options="cityDropdownOptions"
              :currentValue="cityValue"
              @onSelect="cityValue = $event.value"
            ></Dropdown>
          </span>
        </div>
        <div class="row">
          <span class="label">Prix</span>
          <span class="slider">
            <Slider
              v-model="priceValue"
              :min="200"
              :max="3000"
              :step="10"
              :format="{ suffix: '€', decimals: 0 }"
            />
          </span>
        </div>
        <div class="row">
          <span class="label">Surface</span>
          <span class="slider">
            <Slider
              v-model="surfaceValue"
              :min="9"
              :max="100"
              :format="{ suffix: 'm²', decimals: 0 }"
            />
          </span>
        </div>
        <div class="row">
          <span class="label">Nombre de pièce(s)</span>
          <span class="slider">
            <Slider
              v-model="roomValue"
              :min="1"
              :max="6"
              :format="roomValueFct"
            />
          </span>
        </div>
        <div class="row">
          <span class="label">Meublé</span>
          <span>
            <Dropdown
              class="dropdown"
              :options="furnishedDropdownOptions"
              :currentValue="furnishedValue"
              @onSelect="furnishedValue = $event.value"
            >
            </Dropdown>
          </span>
        </div>
        <div class="row" v-if="cityValue !== 'all'">
          <span class="label">Localisation</span>
          <span>
            <MultiDropdown
              class="dropdown"
              :options="districtDropdownOptions"
              :currentValues="districtValues"
              @onSelect="districtValuesChanged($event)"
            >
            </MultiDropdown>
          </span>
        </div>
        <button class="submit-btn" @click="onSubmit">Go</button>
      </div>
    </transition>
  </div>
</template>

<script>
import StrokeIcon from "@/components/icons/StrokeIcon.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import Slider from "@vueform/slider";
import Dropdown from "@/components/Dropdown.vue";
import MultiDropdown from "@/components/MultiDropdown.vue";
import { domain } from "@/helper/config";
import { defineComponent } from "vue";

import "@vueform/slider/themes/default.css";

export default defineComponent({
  name: "Dropfilters",
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  beforeUnmount: function () {
    this.controller.abort();
  },
  watch: {
    cityValue: function () {
      if (this.cityValue !== "all") {
        this.fetchDistricts();
      }

      this.districtValues = [];
    },
  },
  components: {
    ArrowIcon,
    StrokeIcon,
    Slider,
    Dropdown,
    MultiDropdown,
  },
  data() {
    return {
      controller: new AbortController(),
      isOpen: false,
      cityValue: this.options.cityValue,
      cityDropdownOptions: [
        {
          value: "all",
          label: "Tout",
        },
        {
          value: "paris",
          label: "Paris",
        },
        {
          value: "lille",
          label: "Lille",
        },
      ],
      surfaceValue: this.options.surfaceValue,
      roomValue: this.options.roomValue,
      priceValue: this.options.priceValue,
      furnishedDropdownOptions: [
        {
          value: "all",
          label: "Tout",
        },
        {
          value: "furnished",
          label: "Meublé",
        },
        {
          value: "nonFurnished",
          label: "Non meublé",
        },
      ],
      furnishedValue: this.options.furnishedValue,
      districtDropdownOptions: [],
      districtValues: this.options.districtValues,
    };
  },
  methods: {
    onOpen: function () {
      this.isOpen = !this.isOpen;
    },
    onSubmit: function () {
      this.isOpen = false;
      this.$emit("onSubmit", {
        districtValues: this.districtValues,
        cityValue: this.cityValue,
        furnishedValue: this.furnishedValue,
        surfaceValue: this.surfaceValue,
        roomValue: this.roomValue,
        priceValue: this.priceValue,
      });
    },
    roomValueFct: function (value) {
      return `${value} pièce${value > 1 ? "s" : ""}`;
    },
    districtValuesChanged: function (opt) {
      if (this.districtValues.some((value) => value === opt.value)) {
        this.districtValues = this.districtValues.filter(
          (value) => value !== opt.value
        );
      } else {
        this.districtValues = [...this.districtValues, opt.value];
      }
    },
    fetchDistricts: function () {
      fetch(`${domain}stats/district-list/${this.cityValue}`, {
        signal: this.controller.signal,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message === "token expired") {
            throw res;
          } else {
            return res;
          }
        })
        .then((res) => {
          this.districtDropdownOptions = res.map((district) => ({
            value: district,
            label: district,
          }));
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.dropfilters {
  position: relative;
}

.dropfilters > button {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $yellow;
  font-weight: 600;
  height: 36px;
  border-radius: 4px;
  font-size: 20px;
  padding: 6px 12px;
  border-color: transparent;
  transition: background-color ease 0.3s;

  &:hover {
    border: solid $deepblack 2px;
  }
}

.dropfilters > button.dropdown-btn {
  width: 100%;
}

.dropfilters > button.-is-open {
  border: solid $deepblack 2px;
}

.dropfilters > button > span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.arrow-icon {
  margin-left: 4px;
  transition: transform ease 0.3s;
}

.arrow-icon.-is-open {
  transform: rotate(180deg);
}

.dropfilters > button.mobile-back-btn {
  display: none;
}

.option-list {
  position: absolute;
  margin-top: 4px;
  box-sizing: border-box;
  width: 500px;
  padding: 8px 14px;
  background-color: white;
  border-radius: 4px;
  border: 2px solid $deepblack;
  z-index: 1;
}

.option-list > .row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 36px;
  margin: 16px 0;
}

.option-list > .row > span:first-child {
  width: 30%;
}

.option-list > .row > span:last-child {
  width: 70%;
}

.option-list > .row .dropdown {
  display: flex;
  justify-content: center;
}

.option-list > .row .dropdown :deep(button) {
  width: 100%;
}

.option-list > .row :deep(.slider-target .slider-connect) {
  background: $yellow;
}

.option-list > .row :deep(.slider-target .slider-tooltip) {
  background: white;
  color: $deepblack;
  border-color: $yellow;
  line-height: 16px;
  top: 24px;
  bottom: inherit;
}

.option-list > .row :deep(.slider-target .slider-tooltip::before) {
  top: -10px;
  transform: translate(-50%) rotate(180deg);
}

.submit-btn {
  display: flex;
  align-self: flex-end;
  color: $deepblack;
  display: flex;
  justify-content: center;
  font-weight: 400;
  background-color: $yellow;
  cursor: pointer;
  font-weight: 600;
  border-radius: 4px;
  font-size: 14px;
  padding: 6px 12px;
  border-color: transparent;
  transition: background-color ease 0.3s;
  float: right;

  &:hover {
    border: solid $deepblack 2px;
  }
}

.option:hover {
  color: $yellow;
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

@media screen and (max-width: $mobileSize) {
  .dropfilters > button.mobile-back-btn.-is-open {
    z-index: 3;
    position: fixed;
    top: 1em;
    right: 1em;
    display: block;
  }

  .option-list {
    width: 100vw;
    height: 100vh;
    position: fixed;
    padding: 2rem;
    top: 0;
    left: 0;
    z-index: 2;
    margin-top: 0;
    border: none;
    overflow-y: auto;
  }

  .option-list > .row {
    flex-direction: column;
  }

  .option-list > .row > span.label {
    font-weight: 500;
  }

  .option-list > .row > span:first-child {
    margin-bottom: 0.5rem;
  }

  .option-list > .row > span.slider {
    margin-bottom: 1.5rem;
  }

  .option-list > .row > span:first-child,
  .option-list > .row > span:last-child {
    width: 100%;
  }
}
</style>
