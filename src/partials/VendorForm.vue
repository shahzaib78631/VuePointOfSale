<template>
  <v-form ref="form">
    <v-container class="px-0">
      <v-row no-gutters>
        <v-combobox
          v-model="vendor.name"
          :items="Vendors"
          :rules="nameRules"
          variant="outlined"
          label="Vendors"
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
            size="x-large"
            variant="tonal"
            rounded="lg"
            @click="validate"
            block
            >{{ isEdit ? 'Update Vendor' : 'Add Vendor' }}</v-btn
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
import { useVendors } from '@/compositions/VendorService'
import type { PartialBy } from '@/interfaces/Partial'
import type { VendorItem } from '@/interfaces/VendorItem'
import { ref, reactive } from 'vue'

const { Vendors } = useVendors()

// FORM PROPS
interface Props {
  vendor: PartialBy<VendorItem, 'id'>
  isEdit?: boolean
}

// DEFINE FORMS
defineOptions({
  name: 'VendorForm'
})

// DEFINE EMITS
const emits = defineEmits(['onFormSubmit'])

// PROPS
const props = withDefaults(defineProps<Props>(), {
  vendor: () => ({
    name: ''
  }),
  isEdit: false
})

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) =>
    !Vendors.value.find((vendor) => vendor.name === v) ? true : false || 'Vendor already exists',
  (v: string) => (v && v.length >= 3) || 'Name must be greater than 3 characters'
]

const form = ref()
const vendor = reactive(props.vendor)

function reset() {
  form.value.reset()
}

async function validate() {
  const { valid } = await form.value.validate()

  if (valid) {
    emits('onFormSubmit', vendor)
    reset()
  }
}
</script>
