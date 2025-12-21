import { useMutation } from '@tanstack/react-query'
import { uploadResume } from '@/services/api/resumeApi'
import { useResumeStore } from '@/store/resumeStore'

export const useResumeUpload = () => {
  const addResume = useResumeStore((state) => state.addResume)

  return useMutation({
    mutationFn: async ({ file, filename }: { file: File; filename: string }) => {
      const resumeData = await uploadResume(file)
      addResume(resumeData, filename)
      return { resumeData, filename }
    },
  })
}

