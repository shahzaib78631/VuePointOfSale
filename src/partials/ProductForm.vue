<template>
  <v-form ref="form">
    <v-container class="px-0">
      <v-row no-gutters>
        <v-text-field
          variant="outlined"
          :rules="nameRules"
          v-model.trim="product.name"
          label="Product Name"
          required
        />
      </v-row>
      <v-row class="my-2" no-gutters>
        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            :rules="quantityRule"
            @focus="$event.target.select()"
            v-model.number="product.quantity"
            label="Quantity"
          />
        </v-col>
        <div class="mx-2" />
        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            @focus="$event.target.select()"
            v-model.number="product.unitsPerBox"
            label="Units (PB)"
            required
          />
        </v-col>
      </v-row>
      <v-row class="my-2" no-gutters>
        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            :rules="priceRule"
            @focus="$event.target.select()"
            v-model.number="product.purchasingPrice"
            label="Purchase Price"
            required
          />
        </v-col>
        <div class="mx-2" />
        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            :rules="priceRule"
            @focus="$event.target.select()"
            v-model.number="product.price"
            label="Selling Price"
            required
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            @focus="$event.target.select()"
            v-model.number="totalUnits"
            label="Total Units"
          />
        </v-col>
        <div class="mx-2" />
        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            @focus="$event.target.select()"
            v-model.number="unitPrice"
            label="Unit Price"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-combobox
          v-model="selectedVendor"
          :items="Vendors"
          variant="outlined"
          label="Vendor Name"
          item-value="id"
          item-text="name"
          item-title="name"
          clearable
        ></v-combobox>
      </v-row>
      <v-row no-gutters>
        <v-combobox
          v-model="selectedBrand"
          :items="Brands"
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
            variant="tonal"
            size="x-large"
            rounded="lg"
            @click="validate"
            block
            >{{ 'Add Product' }}</v-btn
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
import { useVendors } from '@/compositions/VendorService'
import type { ProductItem } from '@/interfaces/ProductItem'
import { ref, reactive, watchEffect } from 'vue'

const { Brands } = useBrands()
const { Vendors } = useVendors()

// FORM PROPS
interface Props {
  product: ProductItem
  isEdit?: boolean
}

// DEFINE FORMS
defineOptions({
  name: 'ProductForm'
})

// DEFINE EMITS
const emits = defineEmits(['onFormSubmit'])

// PROPS
const props = withDefaults(defineProps<Props>(), {
  product: () => ({
    name: '',
    vendor_id: -1,
    brand_id: -1,
    unitsPerBox: 1,
    unitPrice: 0,
    quantity: 0,
    price: 0,
    purchasingPrice: 0
  }),
  isEdit: false
})

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length >= 3) || 'Name must be greater than 3 characters'
]

const quantityRule = [
  (v: string) => (v && parseInt(v) <= 0 ? 'Quantity can not be less than zero' : true),
  (v: string) => {
    if (!isNaN(parseFloat(v)) && parseFloat(v) >= 0) return true
    return 'Quantity is required'
  }
]

const priceRule = [
  (v: string) => (v && parseInt(v) <= 0 ? 'Price can not be less than zero' : true),
  (v: string) => {
    if (!isNaN(parseFloat(v)) && parseFloat(v) >= 0) return true
    return 'Price is required'
  }
]

const form = ref()
const selectedBrand = ref()
const selectedVendor = ref()
const product = reactive(props.product)
const totalUnits = ref()
const unitPrice = ref()

watchEffect(() => {
  totalUnits.value = Math.floor(product.quantity * product.unitsPerBox) || 0

  if (product.price >= 0)
    unitPrice.value = Math.abs(product.price / product?.unitsPerBox).toFixed(2) || 0
})

function reset() {
  form.value.reset()
  product.brand_id = -1
  product.vendor_id = -1
  product.name = ''
  product.unitPrice = 0
  product.unitsPerBox = 1
  product.price = 0
  product.purchasingPrice = 0
}

async function validate() {
  const { valid } = await form.value.validate()

  if (valid) {
    const tempProduct = {
      ...product,
      unitPrice: parseFloat(unitPrice.value)
    }

    if (selectedBrand?.value?.id) {
      tempProduct.brand_id = selectedBrand?.value?.id
    }

    if (selectedVendor?.value?.id) {
      tempProduct.vendor_id = selectedVendor?.value?.id
    }

    emits('onFormSubmit', tempProduct)
    reset()
  }
}
</script>
