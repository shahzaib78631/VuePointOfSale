<template>
  <v-form ref="form">
    <v-container class="px-0">
      <v-row no-gutters>
        <v-combobox
          v-model="brand.name"
          :items="Brands"
          :rules="nameRules"
          variant="outlined"
          label="Brands"
          item-value="id"
          item-text="name"
          item-title="name"
          clearable
        ></v-combobox>
      </v-row>
      <v-row no-gutters>
        <v-col cols="8">
          <v-btn
            color="primary"
            size="x-large"
            variant="tonal"
            rounded="lg"
            @click="validate"
            block
            >{{ isEdit ? 'Update Brand' : 'Add Brand' }}</v-btn
          >
        </v-col>
        <v-col cols="4" class="pl-4">
          <v-btn color="secondary" variant="tonal" size="x-large" rounded="lg" @click="reset" block>
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { useBrands } from '@/compositions/BrandsService'
import type { BrandItem } from '@/interfaces/BrandItem'
import { ref, reactive } from 'vue'

const { Brands } = useBrands()

// FORM PROPS
interface Props {
  brand: BrandItem
  isEdit?: boolean
}

// DEFINE FORMS
defineOptions({
  name: 'BrandForm'
})

// DEFINE EMITS
const emits = defineEmits(['onFormSubmit'])

// PROPS
const props = withDefaults(defineProps<Props>(), {
  brand: () => ({
    name: ''
  }),
  isEdit: false
})

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) =>
    !Brands.value.find((brand) => brand.name === v) ? true : false || 'Brand already exists',
  (v: string) => (v && v.length >= 3) || 'Name must be greater than 3 characters'
]

const form = ref()
const brand = reactive(props.brand)

function reset() {
  form.value.reset()
}

async function validate() {
  const { valid } = await form.value.validate()

  if (valid) {
    emits('onFormSubmit', brand)
    reset()
  }
}
</script>
