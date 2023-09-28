<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot>
          <v-row no-gutters>
            <v-col class="d-flex justify-start align-center">
              <v-icon size="large" class="mr-4"> mdi-folder </v-icon>
              <span> Add Product </span>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <ProductForm @on-form-submit="updateProduct" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import ProductForm from '../partials/ProductForm.vue'
import { useProducts } from '../compositions/ProductsService'

const { updateProduct } = useProducts()
</script>
