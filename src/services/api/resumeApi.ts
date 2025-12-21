import apiClient from './client'
import { API_ENDPOINTS } from '@/utils/constants'
import { ResumeUploadResponse, ResumeData } from '@/types/resume.types'

export const uploadResume = async (file: File): Promise<ResumeData> => {
  const formData = new FormData()
  formData.append('resume', file)

  const response = await apiClient.post<ResumeUploadResponse>(
    API_ENDPOINTS.RESUME_UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  // Parse the results JSON string
  const parsedResults = JSON.parse(response.data.results) as ResumeData
  return parsedResults
}

