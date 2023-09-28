<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot>
          <v-row no-gutters>
            <v-col class="d-flex justify-start align-center">
              <v-icon size="large" v-bind="props" class="mr-4"> mdi-folder </v-icon>
              <span> Add Brand </span>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <BrandForm :brand="brand" @on-form-submit="addBrand" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useBrands } from '@/compositions/BrandsService'
import type { BrandItem } from '@/interfaces/BrandItem'
import BrandForm from '@/partials/BrandForm.vue'

const { addBrand } = useBrands()

interface Props {
  brand?: BrandItem
}

const props = withDefaults(defineProps<Props>(), {
  brand: () => ({
    name: ''
  })
})

const brand = reactive(props.brand)
</script>
