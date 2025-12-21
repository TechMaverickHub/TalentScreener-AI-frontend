export interface ApiResponse<T> {
  message: string
  status: number
  results: T
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

