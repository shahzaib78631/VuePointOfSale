import { createWebHistory, createRouter } from 'vue-router'

import Products from '@/views/Products.vue'
import Invoices from '@/views/Invoices.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Products
    },
    {
      path: '/invoices',
      name: 'invoices',
      component: Invoices
    }
  ]
})

export default router
