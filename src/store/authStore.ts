import { create } from 'zustand'
import { AuthData } from '@/types/auth.types'
import { setAuthToken, removeAuthToken } from '@/utils/helpers'

interface AuthState {
  isAuthenticated: boolean
  authData: AuthData | null
  login: (authData: AuthData) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  authData: null,
  login: (authData) => {
    setAuthToken(authData.token)
    set({
      isAuthenticated: true,
      authData,
    })
  },
  logout: () => {
    removeAuthToken()
    set({
      isAuthenticated: false,
      authData: null,
    })
  },
}))

