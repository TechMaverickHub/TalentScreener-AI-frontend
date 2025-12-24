import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthData } from '@/types/auth.types'
import { setAuthToken, setRefreshToken, removeAuthToken } from '@/utils/helpers'

interface AuthState {
  isAuthenticated: boolean
  authData: AuthData | null
  login: (authData: AuthData) => void
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      authData: null,
      login: (authData) => {
        setAuthToken(authData.access)
        setRefreshToken(authData.refresh)
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
      initialize: () => {
        const state = get()
        if (state.isAuthenticated && state.authData) {
          // Sync tokens to localStorage if they're not already there
          setAuthToken(state.authData.access)
          setRefreshToken(state.authData.refresh)
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        authData: state.authData,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, sync tokens to localStorage
        if (state?.isAuthenticated && state.authData) {
          setAuthToken(state.authData.access)
          setRefreshToken(state.authData.refresh)
        }
      },
    }
  )
)

