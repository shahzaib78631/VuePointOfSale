<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="productsService.Products.value"
      :search="search"
      item-key="id"
      :sort-by="[{ key: 'name', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-card color="primary" flat pro>
          <v-row align="center" class="mx-1">
            <v-col cols="12" md="4" sm="12">
              <v-text-field
                variant="outlined"
                v-model="search"
                label="Search"
                single-line
                hide-details
                :class="{ 'mt-4': $vuetify.display.smAndDown }"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4" sm="12">
              <v-combobox
                v-model="selectedBrand"
                :items="allBrands"
                variant="outlined"
                label="Brands"
                item-value="id"
                item-text="name"
                item-title="name"
                clearable
                :class="{ 'mt-5': !$vuetify.display.smAndDown }"
                @update:model-value="filterByBrand"
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="4" sm="12">
              <v-combobox
                v-model="selectedVendor"
                :items="allVendors"
                variant="outlined"
                label="Vendors"
                item-value="id"
                item-text="name"
                item-title="name"
                clearable
                :class="{ 'mt-5': !$vuetify.display.smAndDown }"
                @update:model-value="filterByVendors"
              ></v-combobox>
            </v-col>
          </v-row>

          <!-- ADD/EDIT PRODUCT DIALOG -->
          <v-dialog v-model="dialog" max-width="500px">
            <!-- <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props"> New Item </v-btn>
          </template> -->
            <v-card>
              <v-card-title>
                <span class="text-h5">Edit Item</span>
              </v-card-title>

              <v-card-text>
                <ProductEditForm :is-edit="true" :product="editedItem" @on-form-submit="save" />
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close"> Cancel </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- DELETE PRODUCT DIALOG -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </template>
      <template v-slot:[`item.quantity`]="{ item }">
        <td>{{ Math.floor(item.raw.quantity) }}</td>
      </template>
      <template v-slot:[`item.totalUnits`]="{ item }">
        <td justify="center" align="center">
          {{ totalUnits(item.raw) }}
        </td>
      </template>
      <template v-slot:[`item.totalPrice`]="{ item }">
        <td>
          {{ (item.raw.price * item.raw.quantity).toFixed(2) }}
        </td>
      </template>
      <template v-slot:[`item.unitPrice`]="{ item }">
        <td>{{ unitPrice(item.raw) }}</td>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-row justify="center" align="center">
          <v-icon
            size="small"
            @click="addToCart(item.raw, CartActions.REMOVE_FROM_CART)"
            class="mx-2"
          >
            mdi-minus
          </v-icon>
          <v-icon size="small" @click="addToCart(item.raw, CartActions.ADD_TO_CART)" class="mx-2">
            mdi-plus
          </v-icon>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-icon size="small" v-bind="props" class="mx-2"> mdi-dots-vertical </v-icon>
            </template>
            <v-list>
              <v-list-item v-for="(actions, index) in listActions" :key="index" :value="index">
                <v-list-item-title @click="actions.action(item.raw)">{{
                  actions.label
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { nextTick, watch, reactive, ref } from 'vue'
import { useCart } from '@/compositions/CartService'
import { useProducts } from '@/compositions/ProductsService'
import { CartActions } from '@/interfaces/CartActions'
import { type ProductItem } from '@/interfaces/ProductItem'
import { type DataTableHeader } from '@/interfaces/DataTableHeader'
import { useBrands } from '@/compositions/BrandsService'
import ProductEditForm from '@/partials/ProductEditForm.vue'
import { useVendors } from '@/compositions/VendorService'

const { updateCart } = useCart()
const productsService = useProducts()
const { Brands } = useBrands()
const { Vendors } = useVendors()

// EMITS
defineEmits(['addToCart'])

// REFS
const allBrands: any = ref([])
const allVendors: any = ref([])

const selectedBrand = ref()
const selectedVendor = ref()
const editedIndex = ref<number>(-1)
const search = ref<string>('')
const dialog = ref<boolean>(false)
const dialogDelete = ref<boolean>(false)

// REACTIVES
const headers = reactive<Array<DataTableHeader>>([
  {
    title: 'Name',
    key: 'name',
    align: 'start',
    width: '25%'
  },
  { title: 'Total Boxes', key: 'quantity' },
  { title: 'Total Tablets', key: 'totalUnits' },
  { title: 'Tablets (PB)', key: 'unitsPerBox' },
  { title: 'Box Price', key: 'price' },
  { title: 'Tablet Price', key: 'unitPrice' },
  { title: 'Total Price', key: 'totalPrice' },
  { title: 'Actions', key: 'actions', width: '15%', align: 'center', sortable: false }
])

let editedItem = reactive<ProductItem>({
  id: 0,
  name: '',
  unitsPerBox: 0,
  unitPrice: 0,
  quantity: 0,
  price: 0
})

const defaultItem = reactive<ProductItem>({
  id: 0,
  name: '',
  unitsPerBox: 0,
  unitPrice: 0,
  quantity: 0,
  price: 0
})

const listActions = [
  {
    id: 0,
    label: 'Edit',
    action: (item: ProductItem) => editItem(item)
  },
  {
    id: 0,
    label: 'Delete',
    action: (item: ProductItem) => deleteItem(item)
  }
]

// WATHCERS
watch(
  () => Brands.value,
  (val) => (allBrands.value = [{ id: 0, name: 'All Brands' }, ...val])
)
watch(
  () => Vendors.value,
  (val) => (allVendors.value = [{ id: 0, name: 'All Vendors' }, ...val])
)

watch(
  () => dialog.value,
  (val) => val || close()
)
watch(
  () => dialogDelete.value,
  (val) => val || closeDelete()
)

function editItem(item: ProductItem) {
  const index = productsService.Products.value.indexOf(item)
  editedIndex.value = index
  editedItem = Object.assign({}, item)
  dialog.value = true
}

function deleteItem(item: ProductItem) {
  editedIndex.value = productsService.Products.value.indexOf(item)
  editedItem = Object.assign({}, item)
  dialogDelete.value = true
}

function deleteItemConfirm() {
  // Object.assign(Products.value[editedIndex.value], item)
  productsService.deleteProduct(editedItem)
  closeDelete()
}

function close() {
  dialog.value = false
  nextTick(() => {
    editedItem = Object.assign({}, defaultItem)
    editedIndex.value = -1
  })
}

function closeDelete() {
  dialogDelete.value = false
  nextTick(() => {
    editedItem = Object.assign({}, defaultItem)
    editedIndex.value = -1
  })
}

function save(item: ProductItem) {
  if (editedIndex.value > -1) {
    // Object.assign(Products.value[editedIndex.value], item)
    productsService.updateProduct(item)
  }
  close()
}

function addToCart(item: ProductItem, action: CartActions) {
  updateCart(
    {
      id: item.id || 0,
      quantity: 1,
      totalQuantity: item.quantity,
      name: item.name,
      price: parseFloat(unitPrice(item)),
      purchasingPrice: parseFloat(`${item.purchasingPrice}`),
      unitsPerBox: item.unitsPerBox
    },
    action
  )
}

function totalUnits(item: ProductItem) {
  return Math.max(item.quantity * item.unitsPerBox)
}

function unitPrice(item: ProductItem) {
  if (item?.unitPrice) {
    return parseFloat(`${item.unitPrice}`).toFixed(2)
  } else {
    return (item.price / item.unitsPerBox).toFixed(2)
  }
}

/**
 * Handler when user  select some author at the "Author" select.
 */
function filterByBrand() {
  if (!selectedBrand.value?.id || selectedBrand.value?.id === 0)
    return (productsService.Products.value = Object.values(productsService.ProductsList))

  productsService.Products.value = Object.values(productsService.ProductsList).filter(
    (product: ProductItem) => product.brand_id == selectedBrand.value.id
  )
}

/**
 * Handler when user  select some author at the "Author" select.
 */
function filterByVendors() {
  if (!selectedVendor.value?.id || selectedVendor.value?.id === 0)
    return (productsService.Products.value = Object.values(productsService.ProductsList))

  productsService.Products.value = Object.values(productsService.ProductsList).filter(
    (product: ProductItem) => product.vendor_id == selectedVendor.value.id
  )
}
</script>
