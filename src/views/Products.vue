<template>
  <v-container class="spacing-playground pa-4" fluid>
    <v-row>
      <v-col cols="12" sm="12" md="8">
        <Card color="tertiary" :total="totalInvestment" title="Total Investment" />
        <div class="my-4" />
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="4">
            <Card color="indigo" :total="allProducts.length" title="Total Products" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <Card color="secondary" :total="totalBrands" title="Total Brands" />
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <Card color="teal" :total="totalVendors" title="Total Vendors" />
          </v-col>
        </v-row>
        <ProductsList @update-cart="updateCart" />
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <CartOverview />
        <div class="my-4" />
        <BrandEntry />
        <div class="my-4" />
        <VendorEntry />
        <div class="my-4" />
        <ProductEntry />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ProductEntry from '@/components/ProductEntry.vue'
import ProductsList from '@/components/ProductsList.vue'
import Card from '@/components/Card.vue'

import { useCart } from '@/compositions/CartService'
import { useProducts } from '@/compositions/ProductsService'
import { computed, onMounted } from 'vue'
import BrandEntry from '@/components/BrandEntry.vue'
import VendorEntry from '@/components/VendorEntry.vue'
import CartOverview from '@/components/CartOverview.vue'
import { useBrands } from '@/compositions/BrandsService'
import { useVendors } from '@/compositions/VendorService'

const { updateCart } = useCart()
const { subscribeToProductsTable, ...productsService } = useProducts()
const { Brands } = useBrands()
const { Vendors } = useVendors()

const totalBrands = computed(() => {
  return Brands.value.length > 1 ? Brands.value.length - 1 : 0
})

const totalVendors = computed(() => {
  return Vendors.value.length > 1 ? Vendors.value.length - 1 : 0
})

const allProducts = computed(() => Object.values(productsService.ProductsList))

const totalInvestment = computed(() => {
  let total = 0

  allProducts.value.forEach((product) => (total += product.price * product.quantity))

  return total
})

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Products'
})
</script>
