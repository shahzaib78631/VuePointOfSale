<template>
  <v-card :color="props.color" class="pt-2" :class="props.class">
    <v-card-item>
      <div class="text-center">
        <h2>{{ props.total }}</h2>
      </div>
      <div class="text-h6 mb-1 text-center">
        {{ props.title }}
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  total?: string | number
  color?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  total: '',
  color: '',
  class: ''
})

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Card'
})
</script>
