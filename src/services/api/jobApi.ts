import apiClient from './client'
import { API_ENDPOINTS } from '@/utils/constants'
import { JobInput, JobStoreResponse, JobData, JobRoleFilterResponse, JobRoleFilterParams } from '@/types/job.types'
import { ResumeData } from '@/types/resume.types'

export const storeJob = async (jobData: JobInput): Promise<JobData> => {
  const response = await apiClient.post<JobStoreResponse>(
    API_ENDPOINTS.JOB_STORE,
    jobData
  )

  // Parse the description JSON string
  const parsedDescription = JSON.parse(response.data.results.description) as ResumeData

  return {
    title: response.data.results.title,
    description: response.data.results.description,
    parsed_data: parsedDescription,
  }
}

// Placeholder for future CRUD operations
export const getJobs = async (): Promise<JobData[]> => {
  // TODO: Implement when API endpoint is available
  throw new Error('Get jobs endpoint not yet implemented')
}

export const updateJob = async (_id: string, _jobData: JobInput): Promise<JobData> => {
  // TODO: Implement when API endpoint is available
  throw new Error('Update job endpoint not yet implemented')
}

export const deleteJob = async (_id: string): Promise<void> => {
  // TODO: Implement when API endpoint is available
  throw new Error('Delete job endpoint not yet implemented')
}

export const getFilteredJobRoles = async (params: JobRoleFilterParams = {}): Promise<JobRoleFilterResponse> => {
  const queryParams = new URLSearchParams()
  
  if (params.title) {
    queryParams.append('title', params.title)
  }
  
  if (params.description) {
    queryParams.append('description', params.description)
  }
  
  if (params.page) {
    queryParams.append('page', params.page.toString())
  }
  
  const queryString = queryParams.toString()
  const url = queryString ? `${API_ENDPOINTS.JOB_ROLE_LIST_FILTER}?${queryString}` : API_ENDPOINTS.JOB_ROLE_LIST_FILTER
  
  const response = await apiClient.get<JobRoleFilterResponse>(url)
  return response.data
}

