<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot>
          <v-row no-gutters>
            <v-col class="d-flex justify-start align-center">
              <v-icon size="large" v-bind="props" class="mr-4"> mdi-folder </v-icon>
              <span> Add Vendor </span>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <VendorForm :vendor="vendor" @on-form-submit="addVendor" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useVendors } from '@/compositions/VendorService'
import type { VendorItem } from '@/interfaces/VendorItem'
import VendorForm from '@/partials/VendorForm.vue'

const { addVendor } = useVendors()

interface Props {
  vendor?: VendorItem
}

const props = withDefaults(defineProps<Props>(), {
  vendor: () => ({
    name: ''
  })
})

const vendor = reactive(props.vendor)
</script>
