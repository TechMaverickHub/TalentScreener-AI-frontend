import apiClient from './client'
import { API_ENDPOINTS } from '@/utils/constants'
import { LoginCredentials, RegisterCredentials, AuthResponse, AuthData } from '@/types/auth.types'

export const login = async (credentials: LoginCredentials): Promise<AuthData> => {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.LOGIN,
    credentials
  )
  return response.data.results
}

export const register = async (credentials: RegisterCredentials): Promise<AuthData> => {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.REGISTER,
    credentials
  )
  return response.data.results
}

