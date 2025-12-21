import { useMutation } from '@tanstack/react-query'
import { matchResumeToJobs, MatchResult } from '@/services/api/matchingApi'
import { ResumeData } from '@/types/resume.types'

export const useResumeMatching = () => {
  return useMutation<MatchResult[], Error, ResumeData>({
    mutationFn: matchResumeToJobs,
  })
}

