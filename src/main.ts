import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { VuetifyDateAdapter } from 'vuetify/labs/date/adapters/vuetify'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { VDataTable } from 'vuetify/labs/VDataTable'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const POSTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#f5f9fc',
    surface: '#FFFFFF',
    primary: '#6750a4',
    'primary-darken-1': '#3700B3',
    secondary: '#625b71',
    tertiary: '#7d5260',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00'
  }
}

const vuetify = createVuetify({
  components: {
    ...components,
    VDataTable
  },
  directives,
  date: {
    adapter: VuetifyDateAdapter
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      POSTheme
    }
  }
})

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker)
app.use(router).use(vuetify)
app.mount('#app')
