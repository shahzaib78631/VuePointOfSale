<template>
  <v-theme-provider theme="POSTheme" with-background>
    <div v-if="User.loggedIn">
      <v-sheet height="70" color="primary" class="d-flex justify-center">
        <v-row>
          <v-col></v-col>
          <v-col align-self="center" class="d-flex justify-center">
            <span class="text-h6">{{ APPLICATION_NAME }}</span>
          </v-col>
          <v-col align-self="center" class="pr-6">
            <VBtn
              @click="logoutUser"
              class="d-flex ml-auto"
              icon
              color="default"
              size="x-small"
              variant="text"
            >
              <VIcon size="24" icon="mdi-logout" />
            </VBtn>
          </v-col>
        </v-row>
      </v-sheet>
      <RouterView />
      <BottomNavigation />
    </div>
    <div v-else>
      <Auth />
    </div>
  </v-theme-provider>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import BottomNavigation from './components/BottomNavigation.vue'
import Auth from '@/views/Auth.vue'
import { useAuth } from './compositions/AuthService'

import { APPLICATION_NAME } from '@/constants/Info'
import { useProducts } from '@/compositions/ProductsService'
import { useBrands } from '@/compositions/BrandsService'
import { useVendors } from '@/compositions/VendorService'
import { useInvoices } from '@/compositions/InvoiceService'

const { User, logoutUser } = useAuth()

const { getProducts, subscribeToProductsTable } = useProducts()
const { getBrands, subscribeToBrandsTable } = useBrands()
const { getVendors, subscribeToVendorsTable } = useVendors()
const { getInvoices, subscribeToInvoicesTable } = useInvoices()

watch(
  () => User.loggedIn,
  (val) => {
    if (val) {
      // PRODUCTS
      getProducts()
      subscribeToProductsTable()

      // BRANDS
      getBrands()
      subscribeToBrandsTable()

      // VENDORS
      getVendors()
      subscribeToVendorsTable()

      // INVOICES
      getInvoices()
      subscribeToInvoicesTable()
    }
  }
)
</script>
