import apiClient from './client'
import { API_ENDPOINTS } from '@/utils/constants'
import { JobInput, JobStoreResponse, JobData } from '@/types/job.types'
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

