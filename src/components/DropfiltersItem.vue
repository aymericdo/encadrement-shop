<template>
  <DropdownMenu :open="isOpen" @update:open="isOpen = $event">
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        class="relative"
      >
        Filtres
        <span v-if="filtersCount > 0" class="badge-count">{{
          filtersCount
        }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-screen md:absolute md:w-80 lg:w-96">
      <form class="p-4 space-y-6" @submit="onSubmit">
        <FormField name="city">
          <FormItem>
            <FormLabel>Ville</FormLabel>
            <Popover v-model:open="isCityPopoverOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  role="combobox"
                  :aria-expanded="isCityPopoverOpen"
                >
                  {{
                    form.values.city
                      ? cityDropdownOptions
                        .flatMap((group) => group.options)
                        .find(
                          (option) =>
                            option.value === form.values.city
                        )?.label
                      : "Entre ta ville"
                  }}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                class="popover-content"
                :style="{
                  width: 'var(--radix-popover-trigger-width)',
                }"
              >
                <Command @update:model-value="handleSelectCity">
                  <CommandInput
                    class="h-9"
                    placeholder="Rechercher une ville..."
                  />
                  <CommandEmpty>Pas de ville trouvée.</CommandEmpty>
                  <CommandList>
                    <CommandGroup
                      v-for="group in cityDropdownOptions"
                      :key="group.groupBy"
                    >
                      <SelectLabel>{{ group.groupBy }}</SelectLabel>
                      <CommandItem
                        v-for="option in group.options"
                        :key="option.value"
                        :value="option.value"
                        @select="
                          (ev) => {
                            if (typeof ev.detail.value === 'string') {
                              form.setFieldValue(
                                'city',
                                ev.detail.value
                              );
                            }
                            isCityPopoverOpen = false;
                          }
                        "
                      >
                        <CheckIcon
                          :class="
                            cn(
                              'mr-2 h-4 w-4',
                              form.values.city === option.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )
                          "
                        />
                        {{ option.label }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="price">
          <FormItem class="pb-4">
            <FormLabel>Loyer (€)</FormLabel>
            <FormControl>
              <DualRangeSlider
                v-bind="componentField"
                :label="(value: string) => value"
                label-position="bottom"
                :min="0"
                :max="10000"
                :step="1"
                :default-value="[0, 10000]"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <div v-show="isDarkMode">
          <FormField v-slot="{ componentField }" name="exceeding">
            <FormItem class="pb-4">
              <FormLabel>Dépassement 😈 (€)</FormLabel>
              <FormControl>
                <DualRangeSlider
                  v-bind="componentField"
                  :label="(value: string) => value"
                  label-position="bottom"
                  :min="0"
                  :max="10000"
                  :step="1"
                  :default-value="[0, 10000]"
                />
              </FormControl>
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="surface">
          <FormItem class="pb-4">
            <FormLabel>Surface (m²)</FormLabel>
            <FormControl>
              <DualRangeSlider
                v-bind="componentField"
                :label="(value: string) => value"
                label-position="bottom"
                :min="9"
                :max="100"
                :step="1"
                :default-value="[9, 100]"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="rooms">
          <FormItem class="pb-4">
            <FormLabel>Nombre de pièce(s)</FormLabel>
            <FormControl>
              <DualRangeSlider
                v-bind="componentField"
                :label="(value: string) => value"
                label-position="bottom"
                :min="1"
                :max="6"
                :step="1"
                :default-value="[1, 6]"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="furnished">
          <FormItem>
            <FormLabel>Meublé</FormLabel>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in furnishedDropdownOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>

        <div v-show="hasHouse">
          <FormField
            v-slot="{ componentField }"
            name="house"
          >
            <FormItem>
              <FormLabel>Maison</FormLabel>

              <Select
                v-bind="componentField"
                :open="isHasHouseSelectOpen"
                @update:open="isHasHouseSelectOpen = $event"
              >
                <SelectTrigger :open="isHasHouseSelectOpen">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="option in isHouseValueDropdownOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
        </div>

        <div class="flex justify-between mt-4">
          <Button type="button" variant="outline" @click="onReset">
            Réinitialiser
          </Button>
          <Button type="submit"> Appliquer </Button>
        </div>
      </form>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts" setup>
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-icons/vue";
import { DualRangeSlider } from "@/shadcn/ui/dual-range-slider";
import { FormControl, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

interface FiltersOptionsFormInterface {
  surface: [number, number],
  rooms: [number, number],
  price: [number, number],
  exceeding: [number, number],
  furnished: string,
  city: string,
  house: string,
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { useForm } from "vee-validate";
import { computed, ref, toRefs, watch } from "vue";

import "@vueform/slider/themes/default.css";
import store from "@/store";
import { CityElement } from "@/store/modules/relevantAd/state-types";
import { AcceptableValue } from "node_modules/radix-vue/dist/Combobox/ComboboxRoot";

const props = defineProps({
  filtersCount: {
    type: Number,
    required: true,
    default: 0,
  },
  options: {
    type: Object,
    required: true,
    default: null,
  }
});

const emits = defineEmits(["onReset", "onSubmit"]);

const { options, filtersCount } = toRefs(props);

const cityList = computed(() => store.getters[`relevantAd/getCities`]);

const isDarkMode = computed(
  () => store.getters[`relevantAd/getIsDarkMode`]
);

const hasHouse = ref(false);

const formSchema = toTypedSchema(
  z.object({
    surface: z.number().array(),
    rooms: z.number().array(),
    price: z.number().array(),
    exceeding: z.number().array().optional(),
    furnished: z.string(),
    city: z.string(),
    house: z.string(),
  })
);

const initialValues: FiltersOptionsFormInterface = {
  surface: options.value.surfaceValue,
  rooms: options.value.roomValue,
  price: options.value.priceValue,
  exceeding: options.value.exceedingValue,
  furnished: options.value.furnishedValue,
  city: options.value.cityValue,
  house: options.value.isHouseValue || '0',
};

const form = useForm({
  initialValues,
  validationSchema: formSchema,
});

const cityDropdownOptions = ref<{ groupBy: string; options: { value: string, label: string }[] }[]>([]);
const currentFormValues = ref<FiltersOptionsFormInterface>({ ...initialValues });

const isOpen = ref(false);
const isHasHouseSelectOpen = ref(false);
const isCityPopoverOpen = ref(false);
const furnishedDropdownOptions = ref([
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
]);

const isHouseValueDropdownOptions = [
  {
    value: "1",
    label: "Maison",
  },
  {
    value: "0",
    label: "Appartement",
  },
];

watch(
  () => isOpen.value,
  (newValue) => {
    if (newValue) {
      form.setValues({
        ...currentFormValues.value,
      });
    }
  }
);

watch(
  () => cityList.value,
  (newValue) => {
    if (newValue) {
      setCityDropdownOptions(newValue)
    }
  }
);

const setCityDropdownOptions = (currentCityList: { [city: string]: CityElement }) => {
  cityDropdownOptions.value = Object.keys(currentCityList).reduce((prev, city: string, index: number) => {
    if (index === 0) {
      prev.push({ options: [{
        value: "all",
        label: "Tout",
      }], groupBy: 'Tout' });
    }

    const cityElement: CityElement = currentCityList[city];
    const groupAlreadyThere = prev.find(
      ({ groupBy }) => groupBy === cityElement.displayName.mainCity
    );

    if (groupAlreadyThere) {
      groupAlreadyThere.options.push({
        value: city,
        label: cityElement.displayName.city,
      });
    } else {
      prev.push({ options: [{
        value: city,
        label: cityElement.displayName.city,
      }], groupBy: cityElement.displayName.mainCity });
    }

    return prev;
  }, [] as { groupBy: string; options: { value: string, label: string }[] }[]);
};

const handleSelectCity = async (city: AcceptableValue) => {
  hasHouse.value = city === 'all' ? true : cityList.value[city].hasHouse;

  if (form.values.house === null) {
    form.setFieldValue('house', '0');
  }
};

const onReset = () => {
  isOpen.value = false;
  currentFormValues.value = { ...initialValues };

  emits("onReset");
};

const onSubmit = form.handleSubmit((values) => {
  isOpen.value = false;
  currentFormValues.value = { ...values } as FiltersOptionsFormInterface;

  emits("onSubmit", {
    furnishedValue: values.furnished,
    surfaceValue: values.surface,
    roomValue: values.rooms,
    priceValue: values.price,
    exceedingValue: values.exceeding,
    cityValue: values.city,
    houseValue: values.house,
  });
});
</script>

<style scoped lang="scss">
.badge-count {
  @apply absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-sm font-medium text-white;
}
</style>
