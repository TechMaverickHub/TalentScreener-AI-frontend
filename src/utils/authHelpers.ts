import { useAuthStore } from '@/store/authStore'

/**
 * Check if the current user is an admin (Admin or Super Admin)
 */
export const isAdmin = (): boolean => {
  const { authData } = useAuthStore.getState()
  const roleName = authData?.user?.role?.name || ''
  return roleName === 'Admin' || roleName === 'Super Admin'
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

/**
 * Check if user is an admin role (Admin or Super Admin)
 */
export const isAdminRole = (roleName: string): boolean => {
  return roleName === 'Admin' || roleName === 'Super Admin'
}

