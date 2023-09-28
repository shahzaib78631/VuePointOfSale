import { pb } from '@/configs/Pocketbase'
import { reactive, ref } from 'vue'

interface User {
  name: string | null
  loggedIn: boolean
}

export const User = reactive<User>({
  name: null,
  loggedIn: false
})

export function useAuth() {
  const loading = ref(false)

  /**
   * Function for handling pocketbase session
   */
  const retreivePocketbaseSession = async () => {
    if (pb.authStore.isValid) {
      User.loggedIn = true
      User.name = pb.authStore.model?.name
    } else {
      User.loggedIn = false
      User.name = ''
    }
  }

  const retreiveSession = async () => {
    retreivePocketbaseSession()
  }

  /**
   * Function for handling pocketbase login
   * @param email
   * @param password
   */
  const handlePocketbaseLogin = async (email: string, password: string) => {
    try {
      loading.value = true
      const authData = await pb.collection('users').authWithPassword(email, password)
      User.name = pb.authStore.model?.name
      User.loggedIn = true
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading.value = false
    }
  }

  const handleLogin = async (email: string, password: string) => {
    handlePocketbaseLogin(email, password)
  }

  /**
   * Function for logging out from pocketbase
   */
  const logoutPocketbaseUser = () => {
    pb.authStore.clear()

    User.name = ''
    User.loggedIn = false
  }

  const logoutUser = () => {
    logoutPocketbaseUser()
  }

  return {
    User,
    loading,
    handleLogin,
    logoutUser,
    retreiveSession
  }
}
