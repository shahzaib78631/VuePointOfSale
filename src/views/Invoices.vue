<template>
  <v-container class="spacing-playground pa-4" fluid>
    <v-row>
      <v-col cols="12" sm="12" md="4">
        <VCard>
          <VCardItem>
            <VCardTitle>Sales</VCardTitle>

            <template #append>
              <div class="me-n3">
                <VBtn icon color="default" size="x-small" variant="text">
                  <VIcon size="24" icon="mdi-dots-vertical" />
                </VBtn>
              </div>
            </template>
          </VCardItem>

          <VCardText>
            <h6 class="text-body-2 mb-12">
              <span
                >Total {{ getTotalInvoices(Invoices, InvoicesMode.MONTH) }} Invoices Generated
                😎</span
              >
              <span class="font-weight-regular"> this month</span>
            </h6>

            <VRow>
              <VCol v-for="item in invoiceStatistics" :key="item.title" cols="4" sm="4">
                <div class="d-flex align-center">
                  <div class="me-3">
                    <VAvatar :color="item.color" rounded size="42" class="elevation-1">
                      <VIcon size="24" :icon="item.icon" />
                    </VAvatar>
                  </div>

                  <div class="d-flex flex-column">
                    <span class="text-caption">
                      {{ item.title }}
                    </span>
                    <span class="text-h6 font-weight-medium">{{ item.stats }}</span>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <VCard>
          <VCardItem>
            <VCardTitle>Earnings</VCardTitle>

            <template #append>
              <div class="me-n3">
                <VBtn icon color="default" size="x-small" variant="text">
                  <VIcon size="24" icon="mdi-dots-vertical" />
                </VBtn>
              </div>
            </template>
          </VCardItem>

          <VCardText>
            <h6 class="text-body-2 mb-12">
              <span>Total {{ getTotalEarnings(Invoices, InvoicesMode.MONTH) }} PKR Earned 😎</span>
              <span class="font-weight-regular"> this month</span>
            </h6>

            <VRow>
              <VCol v-for="item in earningStatistics" :key="item.title" cols="4" sm="4">
                <div class="d-flex align-center">
                  <div class="me-3">
                    <VAvatar :color="item.color" rounded size="42" class="elevation-1">
                      <VIcon size="24" :icon="item.icon" />
                    </VAvatar>
                  </div>

                  <div class="d-flex flex-column">
                    <span class="text-caption">
                      {{ item.title }}
                    </span>
                    <span class="text-h6 font-weight-medium">{{ item.stats }}</span>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <VCard>
          <VCardItem>
            <VCardTitle>Profit</VCardTitle>

            <template #append>
              <div class="me-n3">
                <VBtn icon color="default" size="x-small" variant="text">
                  <VIcon size="24" icon="mdi-dots-vertical" />
                </VBtn>
              </div>
            </template>
          </VCardItem>

          <VCardText>
            <h6 class="text-body-2 mb-12">
              <span>Total {{ getTotalProfit(Invoices, InvoicesMode.MONTH) }} Profit 😎</span>
              <span class="font-weight-regular"> this month</span>
            </h6>

            <VRow>
              <VCol v-for="item in profitStatistics" :key="item.title" cols="4" sm="4">
                <div class="d-flex align-center">
                  <div class="me-3">
                    <VAvatar :color="item.color" rounded size="42" class="elevation-1">
                      <VIcon size="24" :icon="item.icon" />
                    </VAvatar>
                  </div>

                  <div class="d-flex flex-column">
                    <span class="text-caption">
                      {{ item.title }}
                    </span>
                    <span class="text-h6 font-weight-medium">{{ item.stats }}</span>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </v-col>
    </v-row>
    <div class="ma-4" />
    <!-- <v-card  color="primary" flat height="220" > -->
    <v-sheet rounded="" color="primary" class="pa-5">
      <v-row align="center">
        <v-col>
          <v-text-field
            variant="outlined"
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            density="compact"
            clearable
          />
        </v-col>
        <v-col>
          <VueDatePicker
            v-model="filters.date"
            auto-apply
            :enable-time-picker="false"
            :close-on-auto-apply="true"
          />
        </v-col>
      </v-row>
    </v-sheet>
    <!-- </v-card> -->
    <v-card color="primary" pro>
      <v-data-table
        :headers="headers"
        :items="invoicesList"
        item-key="id"
        :search="search"
        :sort-by="[{ key: 'name', order: 'asc' }]"
      >
        <!-- <template v-slot:top> -->

        <!-- </template> -->
        <template v-slot:[`item.created`]="{ item }">
          <div>
            {{
              new Date(item.raw.created).toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }}
          </div>
        </template>
        <!-- </template> -->
        <template v-slot:[`item.total`]="{ item }">
          <div>{{ getTotal(item.raw.items) }} Rs</div>
        </template>
        <template v-slot:[`item.profit`]="{ item }">
          <div>{{ getProfit(item.raw.items) }} Rs</div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row justify="end" align="center">
            <v-icon
              size="small"
              @click="
                invoiceDialogRef.open(
                  item.raw.items,
                  item.raw.id,
                  item.raw.created,
                  item.raw.sellerName,
                  item.raw?.customerName,
                  item.raw?.discount
                )
              "
              class="mx-2"
            >
              mdi-eye
            </v-icon>
            <v-icon @click="deleteInvoice(item.raw)" size="small" class="mx-2"> mdi-delete </v-icon>
          </v-row>
        </template>
        <template v-slot:tfoot>
          <tr class="sticky-table-footer px-4">
            <td />
            <td class="pa-4" v-text="'Total'" />
            <td />
            <td />
            <td style="padding-left: 15px" v-text="`${getTotalEarnings(invoicesList)} Rs`" />
            <td style="padding-left: 15px" v-text="`${getTotalProfit(invoicesList)} Rs`" />
            <td />
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
  <InvoiceViewDialogVue ref="invoiceDialogRef" />
</template>

<script setup lang="ts">
import InvoiceViewDialogVue from '@/components/InvoiceViewDialog.vue'
import { useInvoices } from '@/compositions/InvoiceService'
import type { CartItem } from '@/interfaces/CartItem'
import type { DataTableHeader } from '@/interfaces/DataTableHeader'
import type { InvoiceItem } from '@/interfaces/InvoiceItem'
import { onMounted, reactive, ref, computed } from 'vue'

// MOMNET
import moment from 'moment'

// HELPERS
import {
  getTotal,
  getProfit,
  getTotalInvoices,
  InvoicesMode,
  formatCompactNumber,
  getTotalEarnings,
  getTotalProfit
} from '@/utils/helpers'

const { Invoices, deleteInvoice } = useInvoices()

import { useDate } from 'vuetify/labs/date'
const date = useDate()

// VARIABLES
const search = ref('')
const invoiceDialogRef = ref()
const filters = reactive({
  date: new Date()
})

const invoicesList = computed(() => {
  if (filters.date === null) {
    return Invoices.value
  } else {
    return Invoices.value.filter(
      (invoice: InvoiceItem) =>
        date.format(invoice.created, 'YYYY-MM-DD') === date.format(filters.date, 'YYYY-MM-DD')
    )
  }
})

// REACTIVES
const headers = reactive<Array<DataTableHeader>>([
  { title: 'ID', key: 'id' },
  {
    title: 'Customer Name',
    key: 'customerName'
  },
  {
    title: 'Seller Name',
    key: 'sellerName'
  },
  { title: 'Date', key: 'created' },
  { title: 'Total', key: 'total' },
  { title: 'Profit', key: 'profit' },
  { title: 'Actions', key: 'actions', align: 'end' }
])

const invoiceStatistics = computed(() => {
  return [
    {
      title: 'YDay',
      stats: formatCompactNumber(getTotalInvoices(Invoices.value, InvoicesMode.YESTERDAY)),
      icon: 'mdi-chart-multiline',
      color: 'blue-grey'
    },
    {
      title: 'Today',
      stats: formatCompactNumber(getTotalInvoices(Invoices.value, InvoicesMode.DAY)),
      icon: 'mdi-trending-up',
      color: 'indigo'
    },
    {
      title: 'Month',
      stats: formatCompactNumber(getTotalInvoices(Invoices.value, InvoicesMode.MONTH)),
      icon: 'mdi-finance',
      color: 'teal'
    }
  ]
})

const earningStatistics = computed(() => {
  return [
    {
      title: 'Yday',
      stats: formatCompactNumber(getTotalEarnings(Invoices.value, InvoicesMode.YESTERDAY) || 0),
      icon: 'mdi-currency-usd',
      color: 'success'
    },
    {
      title: 'Today',
      stats: formatCompactNumber(getTotalEarnings(Invoices.value, InvoicesMode.DAY)),
      icon: 'mdi-currency-inr',
      color: 'brown'
    },
    {
      title: 'Month',
      stats: formatCompactNumber(getTotalEarnings(Invoices.value, InvoicesMode.MONTH)),
      icon: 'mdi-currency-brl',
      color: 'info'
    }
  ]
})

const profitStatistics = computed(() => {
  return [
    {
      title: 'YDay',
      stats: formatCompactNumber(getTotalProfit(Invoices.value, InvoicesMode.YESTERDAY) || 0),
      icon: 'mdi-cash',
      color: 'indigo'
    },
    {
      title: 'Today',
      stats: formatCompactNumber(getTotalProfit(Invoices.value, InvoicesMode.DAY)),
      icon: 'mdi-cash-100',
      color: 'success'
    },
    {
      title: 'Month',
      stats: formatCompactNumber(getTotalProfit(Invoices.value, InvoicesMode.MONTH)),
      icon: 'mdi-cash-multiple',
      color: 'warning'
    }
  ]
})

const total = {
  calories: 3600,
  fat: 105.1
}

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Invoices'
})
</script>

<style>
.sticky-table-footer td {
  font-weight: bold;
  position: sticky;
  bottom: 0;
  background-color: #e1e0e0;
  border-top: thin solid rgba(0, 0, 0, 0.12);
}
</style>
