<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <v-main class="justify-center d-flex">
      <v-container fluid fill-height class="align-center justify-center d-flex">
        <v-card class="elevation-1" width="35%">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <form ref="form" @submit.prevent="handleLogin(user.email, user.password)">
              <v-text-field
                v-model="user.email"
                name="email"
                label="Username"
                type="text"
                placeholder="email"
                required
              ></v-text-field>

              <v-text-field
                v-model="user.password"
                name="password"
                label="Password"
                type="password"
                placeholder="password"
                required
              ></v-text-field>
              <v-btn type="submit" class="mt-4 py-6" color="primary" value="log in" block
                >Login</v-btn
              >
            </form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuth } from '@/compositions/AuthService'
import { onMounted, reactive } from 'vue'

const { handleLogin, retreiveSession } = useAuth()

onMounted(() => retreiveSession())

const user = reactive({
  email: '',
  password: ''
})
</script>
