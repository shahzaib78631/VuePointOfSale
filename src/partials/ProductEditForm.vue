<template>
  <v-form ref="form">
    <v-container class="px-0">
      <v-row no-gutters>
        <v-text-field
          variant="outlined"
          :rules="nameRules"
          v-model.trim="product.name"
          label="Name"
          required
        />
      </v-row>
      <!-- <v-row class="my-2" no-gutters>
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
            label="Tablets (PB)"
            required
          />
        </v-col>
      </v-row> -->
      <v-row class="my-2" no-gutters>
        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            :rules="quantityRule"
            @focus="$event.target.select()"
            v-model.number="remainingBoxes"
            label="Remaining Boxes"
          />
        </v-col>
        <div class="mx-2" />
        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            @focus="$event.target.select()"
            v-model.number="remainingUnits"
            label="Remaining Units"
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
      </v-row>
      <v-row class="my-2" no-gutters>
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
      <v-row no-gutters>
        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            v-model.number="totalUnits"
            label="Total Units"
            readonly
            disabled
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
          :items="Brands"
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
      <v-btn color="primary" variant="tonal" size="x-large" rounded="lg" @click="validate" block>{{
        'Update Product'
      }}</v-btn>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { useBrands } from '@/compositions/BrandsService'
import { useVendors } from '@/compositions/VendorService'
import type { PartialBy } from '@/interfaces/Partial'
import type { ProductItem } from '@/interfaces/ProductItem'
import { onMounted } from 'vue'
import { watch, watchEffect, ref, reactive } from 'vue'

const { Brands } = useBrands()
const { Vendors } = useVendors()

// FORM PROPS
interface Props {
  product: PartialBy<ProductItem, 'id'>
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
    brand_id: -1,
    vendor_id: -1,
    unitsPerBox: 0,
    unitPrice: 0,
    quantity: 0,
    price: 0,
    purchasingPrice: 0
  }),
  isEdit: false
})

const nameRules = [
  (v: string) => !!v || 'Peoduct Name is required',
  (v: string) => (v && v.length >= 3) || 'Product Name must be greater than 3 characters'
]

const quantityRule = [
  (v: string) => {
    if (!isNaN(parseFloat(v)) && parseFloat(v) >= 0) return true
    return 'Quantity is required'
  }
]

const priceRule = [
  (v: string) => {
    if (!isNaN(parseFloat(v)) && parseFloat(v) >= 0) return true
    return 'Price is required'
  }
]

const form = ref()
const selectedBrand = ref(Brands.value.find((brand) => brand.id === props.product?.brand_id))
const selectedVendor = ref(Vendors.value.find((vendor) => vendor.id === props.product?.vendor_id))
const product = reactive(props.product)
const totalUnits = ref()
const unitPrice = ref(product?.unitPrice)
const remainingBoxes = ref()
const remainingUnits = ref()

onMounted(() => {
  remainingBoxes.value = parseInt(`${product.quantity}`)
  remainingUnits.value = (product.quantity - remainingBoxes.value) * product.unitsPerBox

  console.log(
    Vendors.value.find((vendor) => vendor.id === props.product?.vendor_id),
    props.product?.vendor_id
  )
})

watchEffect(() => {
  totalUnits.value = Math.floor(product.quantity * product.unitsPerBox) || 0
})

watch(
  () => product.price,
  () => {
    unitPrice.value = Math.abs(product.price / product?.unitsPerBox).toFixed(2) || 0
  }
)

watch(
  () => product.unitsPerBox,
  () => {
    unitPrice.value = Math.abs(product.price / product?.unitsPerBox).toFixed(2) || 0
  }
)

async function validate() {
  const { valid } = await form.value.validate()

  if (valid) {
    const tempProduct = {
      ...product,
      // totalUnits: totalUnits.value,
      unitPrice: parseFloat(`${unitPrice.value}`),
      quantity: remainingBoxes.value + remainingUnits.value / product.unitsPerBox
    }

    if (selectedBrand?.value?.id) {
      tempProduct.brand_id = selectedBrand?.value?.id
    }

    if (selectedVendor?.value?.id) {
      tempProduct.vendor_id = selectedVendor?.value?.id
    }

    emits('onFormSubmit', tempProduct)
  }
}
</script>
