<template>
  <v-expansion-panels v-model="panels">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot>
          <v-row no-gutters>
            <v-col class="d-flex justify-start align-center">
              <v-badge :content="total.quantity" color="tertiary">
                <v-icon size="large"> mdi-cart </v-icon>
              </v-badge>
              <span class="ml-4"> Cart Overview </span>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-data-table
          :headers="headers"
          :items="cartItemsList"
          item-key="id"
          :sort-by="[{ key: 'name', order: 'asc' }]"
          density="compact"
          items-per-page="-1"
        >
          <template v-slot:[`item.quantity`]="{ item }">
            <v-text-field
              variant="outlined"
              density="compact"
              @focus="$event.target.select()"
              v-model.number="item.raw.quantity"
              class="mt-4"
            ></v-text-field>
          </template>
          <template v-slot:[`item.price`]="{ item }">
            <v-text-field
              variant="outlined"
              density="compact"
              @focus="$event.target.select()"
              v-model.number="item.raw.price"
              label="Edit"
              single-line
              class="mt-4"
            ></v-text-field>
          </template>
          <template v-slot:[`item.subTotal`]="{ item }">
            <div class="ml-4">{{ subTotal(item.raw) }}</div>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              size="small"
              @click="updateCart(item.raw, CartActions.DELETE_FROM_CART)"
              class="mx-2"
            >
              mdi-delete
            </v-icon>
          </template>
          <template #bottom>
            <v-divider class="mt-8 mb-4" />
            <v-row>
              <v-col>
                <div class="font-weight-bold">Total Items:</div>
              </v-col>
              <v-col class="mr-4">
                <div class="font-weight-bold text-right">{{ total.quantity }}</div>
              </v-col>
            </v-row>
            <div class="mt-4" />
            <v-row no-gutters>
              <v-col>
                <div class="font-weight-bold">Discount:</div>
              </v-col>
              <v-col>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  @focus="$event.target.select()"
                  v-model.number="details.discount"
                  label="Discount"
                  suffix="%"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <div class="font-weight-bold">Total Price:</div>
              </v-col>
              <v-col>
                <div class="font-weight-bold text-right">{{ total.price }} Rs</div>
              </v-col>
            </v-row>
            <v-divider title="Details" class="my-4" />
            <v-row no-gutters>
              <v-text-field
                variant="outlined"
                v-model="details.customerName"
                density="compact"
                label="Customer Name"
              />
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  @focus="$event.target.select()"
                  v-model.number="details.paidAmount"
                  label="Paid Amount"
                  suffix="Rs"
                />
              </v-col>
              <div class="mx-2" />
              <v-col>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  v-model="amountRemaining"
                  label="Remaining Amount"
                  readonly
                  suffix="Rs"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  v-model="amountToReturn"
                  label="Amount Returned"
                  readonly
                  suffix="Rs"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="8">
                <v-btn
                  color="primary"
                  variant="tonal"
                  size="x-large"
                  rounded="lg"
                  @click="handleSale"
                  block
                  >{{ 'Sale' }}</v-btn
                >
              </v-col>
              <v-col cols="4" class="pl-4">
                <v-btn
                  color="secondary"
                  variant="tonal"
                  size="x-large"
                  rounded="lg"
                  @click="resetCart()"
                  block
                  >{{ 'Reset' }}</v-btn
                >
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { type DataTableHeader } from '@/interfaces/DataTableHeader'
import { useCart } from '@/compositions/CartService'
import { computed } from 'vue'
import { reactive } from 'vue'
import type { CartItem } from '@/interfaces/CartItem'
import { ref } from 'vue'
import { watchEffect } from 'vue'
import { CartActions } from '@/interfaces/CartActions'

const { CartItems, handleCheckout, updateCart, resetCart } = useCart()

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
  { title: 'Total', key: 'subTotal', align: 'start' },
  { title: 'Actions', key: 'actions', align: 'end' }
])

const panels = ref([0])
const cartItemsList = ref<Array<CartItem>>([])
watchEffect(() => {
  cartItemsList.value = Object.values(CartItems)
  if (cartItemsList.value.length > 0 && headers.length < 5) {
    headers.push({ title: 'Actions', key: 'actions', align: 'end' })
  } else if (cartItemsList.value.length === 0) {
    headers.pop()
  }
})

function subTotal(item: CartItem) {
  return item?.quantity * item?.price
}

const details = reactive({
  discount: 0,
  customerName: '',
  paidAmount: 0
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

const remainingAmount = computed(() => total.value.price - details.paidAmount)
const amountToReturn = ref(0)
const amountRemaining = ref(0)

watchEffect(() => {
  amountToReturn.value = remainingAmount.value < 0 ? Math.abs(remainingAmount.value) : 0
  amountRemaining.value = remainingAmount.value > 0 ? Math.abs(remainingAmount.value) : 0
})

const handleSale = () => {
  handleCheckout(details, total.value)
  Object.assign(details, {
    discount: 0,
    customerName: '',
    paidAmount: 0
  })
  amountToReturn.value = 0
  amountRemaining.value = 0
}
</script>
