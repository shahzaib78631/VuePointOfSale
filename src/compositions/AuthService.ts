import { supabase } from '@/configs/Supabase'
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
   * Function for handling supabase session
   */
  const retreiveSupabaseSession = async () => {
    const { data, error } = await supabase.auth.getSession()

    console.log(data, error)

    if (!error) {
      if (data?.session !== null) {
        User.loggedIn = true
        User.name = data.session?.user.email || null
      } else {
        User.loggedIn = false
        User.name = ''
      }
    }
  }

  const retreiveSession = async () => {
    retreiveSupabaseSession()
  }

  /**
   * Function for handling supabase login
   * @param email
   * @param password
   */
  const handleSupabaseLogin = async (email: string, password: string) => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) throw error
      else {
        User.name = email.split('@')[0].replace('_', ' ')
        User.loggedIn = true
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading.value = false
    }
  }

  const handleLogin = async (email: string, password: string) => {
    handleSupabaseLogin(email, password)
  }

  /**
   * Function for logging out from supabase
   */
  const logoutSupabaseUser = () => {
    supabase.auth.signOut()

    User.name = ''
    User.loggedIn = false
  }

  const logoutUser = () => {
    logoutSupabaseUser()
  }

  return {
    User,
    loading,
    handleLogin,
    logoutUser,
    retreiveSession
  }
}
