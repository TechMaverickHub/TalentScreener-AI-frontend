import { useAuthStore } from '@/store/authStore'

/**
 * Check if the current user is an admin
 */
export const isAdmin = (): boolean => {
  const { authData } = useAuthStore.getState()
  return authData?.user?.role?.name === 'Admin'
}

/**
 * Check if the current user is a regular user
 */
export const isRegularUser = (): boolean => {
  const { authData } = useAuthStore.getState()
  return authData?.user?.role?.name === 'Regular User'
}

/**
 * Get the current user's role name
 */
export const getUserRole = (): string | null => {
  const { authData } = useAuthStore.getState()
  return authData?.user?.role?.name || null
}

/**
 * Check if user has a specific role
 */
export const hasRole = (roleName: string): boolean => {
  const { authData } = useAuthStore.getState()
  return authData?.user?.role?.name === roleName
}

