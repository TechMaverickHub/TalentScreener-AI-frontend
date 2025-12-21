import apiClient from './client'
import { API_ENDPOINTS } from '@/utils/constants'
import { ResumeData } from '@/types/resume.types'
import { JobData } from '@/types/job.types'

export interface MatchResult {
  job: JobData
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  experience_match: boolean
}

export interface MatchResponse {
  message: string
  status: number
  results: MatchResult[] | MatchResult
}

export const matchResumeToJobs = async (resumeData: ResumeData): Promise<MatchResult[]> => {
  const response = await apiClient.post<MatchResponse>(
    API_ENDPOINTS.RESUME_MATCH,
    { resume_data: resumeData }
  )

  // Handle both single result and array of results
  const results = Array.isArray(response.data.results)
    ? response.data.results
    : [response.data.results]

  return results
}

