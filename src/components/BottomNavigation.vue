<template>
  <v-layout class="overflow-visible" style="height: 56px">
    <v-bottom-navigation v-model="value" active height="55" grow>
      <v-btn block>
        <v-icon size="large">mdi-history</v-icon>
        <span> Products </span>
      </v-btn>

      <v-btn to="/invoices" block>
        <v-icon size="large">mdi-map-marker</v-icon>
        <span>Invoices</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script setup lang="ts">
import { useCart } from '@/compositions/CartService'
import { computed } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { CartItems } = useCart()

const router = useRouter()
const value = ref<number>(0)

const color = computed(() => {
  switch (value.value) {
    case 0:
      return 'blue-grey'
    case 1:
      return 'teal'
    case 2:
      return 'brown'
    case 3:
      return 'indigo'
    default:
      return 'blue-grey'
  }
})

watch(
  () => value.value,
  (value) => {
    const route = {
      0: '/',
      1: 'invoices'
    }[value]

    router.push({ path: `${route}` })
  }
)
</script>
