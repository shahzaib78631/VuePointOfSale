<template>
  <!-- ADD/EDIT PRODUCT DIALOG -->
  <v-dialog v-model="dialog" max-width="900px">
    <v-container>
      <v-card>
        <v-card flat pro color="tertiary" class="pa-4 rounded-0">
          <div class="font-weight-bold text-center text-h4 my-4">Invoice</div>
        </v-card>
        <v-card flat pro variant="tonal" color="secondary" class="pa-4 rounded-0">
          <v-row>
            <v-col class="justify-space-between align-center d-flex flex-row">
              <div class="font-weight-bold text-left">No:</div>
              <div class="font-weight-bold text-right">{{ details.number }}</div>
            </v-col>
            <v-col class="justify-space-between align-center d-flex flex-row">
              <div class="font-weight-bold text-left">Date:</div>
              <div class="font-weight-bold text-right">
                {{
                  new Date(details.date).toLocaleDateString('en-us', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }}
              </div>
            </v-col>
          </v-row>
          <div class="mt-4" />
          <v-row>
            <v-col class="justify-space-between align-center d-flex flex-row">
              <div class="font-weight-bold text-left">Customer Name:</div>
              <div class="font-weight-bold text-right">{{ details.customerName }}</div>
            </v-col>
            <v-col class="justify-space-between align-center d-flex flex-row">
              <div class="font-weight-bold text-left">Seller Name:</div>
              <div class="font-weight-bold text-right">{{ details.sellerName }}</div>
            </v-col>
          </v-row>
        </v-card>
        <v-divider />
        <v-data-table
          items-per-page="-1"
          :headers="headers"
          :items="cartItemsList"
          item-key="id"
          class="pa-4"
        >
          <template v-slot:[`item.subTotal`]="{ item }">
            <div class="ml-6">{{ subTotal(item.raw) }}</div>
          </template>
          <template v-slot:[`item.profit`]="{ item }">
            <div class="ml-6">{{ getProfit([item.raw]) }}</div>
          </template>
          <template #bottom>
            <v-divider class="mt-8 mb-4" />
            <v-row no-gutters>
              <v-col> </v-col>
              <v-col class="justify-space-between align-center d-flex flex-row">
                <div class="font-weight-bold text-left">Total Items:</div>
                <div class="font-weight-bold text-right">{{ total.quantity }}</div>
              </v-col>
            </v-row>
            <div class="mt-4" />
            <v-row no-gutters>
              <v-col> </v-col>
              <v-col class="justify-space-between align-center d-flex flex-row">
                <div class="font-weight-bold text-left">Discount:</div>
                <div class="font-weight-bold text-right">{{ details.discount }} %</div>
              </v-col>
            </v-row>
            <div class="mt-4" />
            <v-row no-gutters>
              <v-col> </v-col>
              <v-col class="justify-space-between align-center d-flex flex-row">
                <div class="font-weight-bold">Total Price:</div>
                <div class="font-weight-bold text-right">{{ total.price }} Rs</div>
              </v-col>
            </v-row>
            <div class="mt-4" />
            <v-row no-gutters>
              <v-col> </v-col>
              <v-col class="justify-space-between align-center d-flex flex-row">
                <div class="font-weight-bold">Total Profit:</div>
                <div class="font-weight-bold text-right">{{ getProfit(cartItemsList) }} Rs</div>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script setup lang="ts">
import { type DataTableHeader } from '@/interfaces/DataTableHeader'
import { useCart } from '@/compositions/CartService'
import { computed } from 'vue'
import { reactive } from 'vue'
import type { CartItem } from '@/interfaces/CartItem'
import { ref } from 'vue'
import { watchEffect, watch } from 'vue'
import { getProfit } from '@/utils/helpers'

const dialog = ref<boolean>(false)

// WATHCERS
watch(
  () => dialog.value,
  (val) => val || close()
)

function close() {
  dialog.value = false
}

// REACTIVES
const headers = reactive<Array<DataTableHeader>>([
  {
    title: 'Name',
    key: 'name',
    align: 'start',
    width: '40%'
  },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Price', key: 'price' },
  { title: 'Total', key: 'subTotal' },
  { title: 'Profit', key: 'profit', align: 'end' }
])

const cartItemsList = ref<Array<CartItem>>([])

function subTotal(item: CartItem) {
  return item?.quantity * item?.price
}

const details = reactive({
  number: 0,
  discount: 0,
  customerName: '',
  sellerName: '',
  date: new Date()
})

const total = computed(() => {
  const tempTotal = {
    price: 0,
    quantity: 0
  }

  cartItemsList.value.forEach((i) => {
    tempTotal.price += subTotal(i)
    tempTotal.quantity += i.quantity
  })

  if (details.discount !== 0) {
    const totalDiscount = tempTotal.price * (details.discount / 100)
    tempTotal.price = Math.abs(tempTotal.price - totalDiscount)
  }

  return tempTotal
})

function open(
  items: Array<CartItem>,
  id: number,
  date: any,
  sellerName: string,
  customerName: string,
  discount: number
) {
  // SHOW THE DIALOG
  dialog.value = true

  // CART ITEMS
  cartItemsList.value = items

  // DETAILS
  details.number = id
  details.customerName = customerName
  details.discount = discount
  details.date = date
  details.sellerName = sellerName
}

defineExpose({ open })
</script>

<style>
::v-deep .v-data-table-header {
  background-color: #dcdcdc;
}
</style>
