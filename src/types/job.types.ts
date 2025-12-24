import { ResumeData } from './resume.types'

export interface JobInput {
  title: string
  description: string
}

export interface JobData {
  id?: string
  title: string
  description: string
  parsed_data: ResumeData
  created_at?: string
  updated_at?: string
}

export interface JobStoreResponse {
  message: string
  status: number
  results: {
    title: string
    description: string // JSON string that needs to be parsed
  }
}

export interface JobRoleFilterItem {
  title: string
  description: string | ResumeData // Can be JSON string or parsed object
}

export interface JobRoleFilterResponse {
  count: number
  next: string | null
  previous: string | null
  results: JobRoleFilterItem[]
}

export interface JobRoleFilterParams {
  title?: string
  description?: string
  page?: number
}

