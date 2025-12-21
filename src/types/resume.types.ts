export interface ResumeData {
  years_of_experience: number
  skills: string[]
  technical_experience: string
  summary: string | null
}

export interface ResumeWithId extends ResumeData {
  id: string
  filename: string
  uploaded_at: string
}

export interface ResumeUploadResponse {
  message: string
  status: number
  results: string // JSON string that needs to be parsed
}

