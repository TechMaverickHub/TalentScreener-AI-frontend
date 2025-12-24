export interface User {
  pk: string
  email: string
  first_name: string
  last_name: string
  role: {
    pk: number
    name: string
  }
}

export interface AuthData {
  access: string
  refresh: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface AuthResponse {
  message: string
  status: number
  results: AuthData
}

