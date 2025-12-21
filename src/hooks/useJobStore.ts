import { useMutation } from '@tanstack/react-query'
import { storeJob } from '@/services/api/jobApi'
import { useJobStore } from '@/store/jobStore'
import { JobInput } from '@/types/job.types'

export const useJobStoreMutation = () => {
  const addJob = useJobStore((state) => state.addJob)

  return useMutation({
    mutationFn: async (jobData: JobInput) => {
      const job = await storeJob(jobData)
      addJob(job)
      return job
    },
  })
}

