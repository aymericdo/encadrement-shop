<template>
  <div class="dropfilters">
    <button
      class="dropdown-btn"
      @click="onOpen()"
      :class="{ '-is-open': isOpen }"
    >
      <span>Filtres</span>
      <span v-if="filtersCount > 0" class="badge-count">{{
        filtersCount
      }}</span>
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
              :currentValue="optionValues.cityValue"
              @onSelect="onCityChange"
            ></Dropdown>
          </span>
        </div>
        <div v-if="hasHouse" class="row">
          <span class="label">Maison</span>
          <span>
            <Dropdown
              class="dropdown"
              :options="isHouseValueDropdownOptions"
              :currentValue="optionValues.isHouseValue"
              @onSelect="optionValues.isHouseValue = $event.value"
            >
            </Dropdown>
          </span>
        </div>
        <div class="row">
          <span class="label">Prix</span>
          <span class="slider">
            <Slider
              v-model="optionValues.priceValue"
              :min="200"
              :max="3000"
              :step="10"
              :format="{ suffix: '€', decimals: 0 }"
            />
          </span>
        </div>
        <div v-if="isDarkMode" class="row">
          <span class="label">Dépassement</span>
          <span class="slider">
            <Slider
              v-model="optionValues.exceedingValue"
              :min="0"
              :max="1000"
              :format="{ suffix: '€', decimals: 0 }"
            />
          </span>
        </div>
        <div class="row">
          <span class="label">Surface</span>
          <span class="slider">
            <Slider
              v-model="optionValues.surfaceValue"
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
              v-model="optionValues.roomValue"
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
              :currentValue="optionValues.furnishedValue"
              @onSelect="optionValues.furnishedValue = $event.value"
            >
            </Dropdown>
          </span>
        </div>
        <div
          class="row"
          v-if="optionValues.cityValue !== 'all' && optionValues.districtValues"
        >
          <span class="label">Localisation</span>
          <span>
            <MultiDropdown
              class="dropdown"
              :options="districtDropdownOptions"
              :currentValues="optionValues.districtValues"
              @onSelect="districtValuesChanged($event)"
            >
            </MultiDropdown>
          </span>
        </div>
        <div class="row actions-btn">
          <button class="reset-btn" @click="onReset">Réinitialiser</button>
          <button class="submit-btn" @click="onSubmit">Rechercher</button>
        </div>
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
import { useStore } from "vuex";
import {
  defineComponent,
  ref,
  toRefs,
  watch,
  computed,
  watchEffect,
} from "vue";

import "@vueform/slider/themes/default.css";

export default defineComponent({
  name: "Dropfilters",
  props: {
    options: {
      type: Object,
      required: true,
    },
    filtersCount: {
      type: Number,
    },
  },
  beforeUnmount: function () {
    this.controller.abort();
  },
  components: {
    ArrowIcon,
    StrokeIcon,
    Slider,
    Dropdown,
    MultiDropdown,
  },
  setup(props, { emit }) {
    const store = useStore();
    const { options } = toRefs(props);
    const controller = new AbortController();
    const districtDropdownOptions = ref([]);
    const hasHouse = ref(false);
    const isOpen = ref(false);

    const cityDropdownOptions = ref([]);

    const cityList = computed(() => store.getters[`relevantAd/getCities`]);

    const isDarkMode = computed(
      () => store.getters[`relevantAd/getIsDarkMode`]
    );

    const optionValues = ref({ ...options.value });

    const fetchDistricts = () => {
      fetch(`${domain}districts/list/${optionValues.value.cityValue}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((res) => {
          districtDropdownOptions.value = res.map((district) => ({
            groupBy: district.groupBy,
            value: district.value,
            label: district.label,
          }));
        })
        .catch((err) => {
          console.error(err);
        });
    };

    watch(
      () => props.options,
      (newValue) => {
        optionValues.value = newValue;

        if (optionValues.value.cityValue !== newValue.cityValue) {
          onCityChange({ value: newValue.cityValue });
        }
      }
    );

    const onSubmit = () => {
      isOpen.value = false;
      emit("onSubmit", {
        districtValues: optionValues.value.districtValues || null,
        cityValue: optionValues.value.cityValue,
        furnishedValue: optionValues.value.furnishedValue,
        surfaceValue: optionValues.value.surfaceValue,
        roomValue: optionValues.value.roomValue,
        priceValue: optionValues.value.priceValue,
        exceedingValue: optionValues.value.exceedingValue,
        isHouseValue: optionValues.value.isHouseValue,
      });
    };

    const onCityChange = (event) => {
      optionValues.value.cityValue = event.value;
      hasHouse.value = !!cityDropdownOptions.value.find(
        (c) => c.value === optionValues.value.cityValue
      )?.hasHouse;

      if (!hasHouse.value) {
        optionValues.value.isHouseValue = null;
      }

      if (optionValues.value.cityValue) {
        if (optionValues.value.cityValue !== "all") {
          fetchDistricts();
        }
        optionValues.value.districtValues = [];
      }
    };

    const onOpen = () => {
      isOpen.value = !isOpen.value;
    };

    const onReset = () => {
      isOpen.value = false;
      emit("onReset");
    };

    watchEffect(
      () => {
        if (cityList.value) {
          const currentCityList = { ...cityList.value };

          cityDropdownOptions.value = Object.keys(currentCityList).reduce(
            (prev, city, index) => {
              if (index === 0) {
                prev.push({
                  value: "all",
                  label: "Tout",
                  hasHouse: true,
                });
              }

              if (
                prev.some(
                  (value) => value.value === currentCityList[city].mainCity
                )
              )
                return prev;

              prev.push({
                value: currentCityList[city].mainCity,
                label: currentCityList[city].displayName.mainCity,
                hasHouse: currentCityList[city].hasHouse,
              });
              return prev;
            },
            []
          );
        }
      },
      {
        flush: "post",
      }
    );

    return {
      controller,
      isOpen,
      optionValues,
      onSubmit,
      onCityChange,
      onOpen,
      fetchDistricts,
      onReset,
      isDarkMode,
      cityDropdownOptions,
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
      isHouseValueDropdownOptions: [
        {
          value: null,
          label: "Tout",
        },
        {
          value: 1,
          label: "Maison",
        },
        {
          value: 0,
          label: "Appartement",
        },
      ],
      hasHouse,
      districtDropdownOptions,
    };
  },
  methods: {
    roomValueFct: function (value) {
      return `${value} pièce${value > 1 ? "s" : ""}`;
    },
    districtValuesChanged: function (opts) {
      if (opts.length < 2) {
        const opt = opts[0];
        if (
          this.optionValues.districtValues.some((value) => value === opt.value)
        ) {
          this.optionValues.districtValues =
            this.optionValues.districtValues.filter(
              (value) => value !== opt.value
            );
        } else {
          this.optionValues.districtValues = [
            ...this.optionValues.districtValues,
            opt.value,
          ];
        }
      } else {
        if (
          opts.every((opt) =>
            this.optionValues.districtValues.some(
              (value) => value === opt.value
            )
          )
        ) {
          this.optionValues.districtValues =
            this.optionValues.districtValues.filter(
              (value) => !opts.map((o) => o.value).includes(value)
            );
        } else {
          this.optionValues.districtValues = [
            ...this.optionValues.districtValues,
            ...opts
              .map((o) => o.value)
              .filter(
                (v) =>
                  !this.optionValues.districtValues.some((value) => value === v)
              ),
          ];
        }
      }
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
  justify-content: space-around;
  gap: 1rem;
  align-items: center;
  background-color: $yellow;
  font-weight: 600;
  height: 36px;
  font-size: 20px;
  padding: 6px 12px;
  transition: background-color ease 0.3s;
  border: solid transparent 1px;
  border-radius: 4px;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border: solid $deepblack 1px;
    }
  }
}

.dropfilters > button.dropdown-btn {
  width: 100%;
}

.dropfilters > button.dropdown-btn > .badge-count {
  position: absolute;
  top: -14px;
  left: -14px;
  border-radius: 50%;
  font-size: 1rem;
  background-color: $deepblack;
  color: white;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropfilters > button.-is-open {
  border: solid $deepblack 1px;
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
  border: solid $deepblack 1px;
  z-index: 1001;
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

.row.actions-btn {
  display: flex;
  justify-content: flex-end;
}

.reset-btn {
  display: flex;
  align-self: flex-end;
  color: white;
  display: flex;
  justify-content: center;
  font-weight: 400;
  background-color: white;
  color: $deepblack;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  padding: 6px 12px;
  border: solid transparent 1px;
  border-radius: 4px;
  transition: background-color ease 0.3s;
  margin-right: 0.875rem;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border: solid $deepblack 1px;
    }
  }
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
  font-size: 14px;
  padding: 6px 12px;
  border: solid transparent 1px;
  border-radius: 4px;
  transition: background-color ease 0.3s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border: solid $deepblack 1px;
    }
  }
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
    display: flex;
    z-index: 1002;
    position: fixed;
    top: 1em;
    right: 1em;
  }

  .option-list {
    width: 100vw;
    height: 100vh;
    position: fixed;
    padding: 2rem;
    top: 0;
    left: 0;
    margin-top: 0;
    border: none;
    overflow-y: auto;
  }

  .option-list > .row:not(.actions-btn) {
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
