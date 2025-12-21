export interface AuthData {
  token: string
  refresh_token?: string
  user?: {
    id: string
    email: string
    name?: string
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

