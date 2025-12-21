import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ResumeWithId, ResumeData } from '@/types/resume.types'

interface ResumeState {
  resumes: ResumeWithId[]
  selectedResume: ResumeWithId | null
  addResume: (resume: ResumeData, filename: string) => void
  removeResume: (id: string) => void
  selectResume: (id: string) => void
  clearSelectedResume: () => void
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resumes: [],
      selectedResume: null,
      addResume: (resumeData, filename) => {
        const newResume: ResumeWithId = {
          ...resumeData,
          id: Date.now().toString(),
          filename,
          uploaded_at: new Date().toISOString(),
        }
        set((state) => ({
          resumes: [...state.resumes, newResume],
        }))
      },
      removeResume: (id) => {
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
          selectedResume:
            state.selectedResume?.id === id ? null : state.selectedResume,
        }))
      },
      selectResume: (id) => {
        set((state) => ({
          selectedResume: state.resumes.find((r) => r.id === id) || null,
        }))
      },
      clearSelectedResume: () => {
        set({ selectedResume: null })
      },
    }),
    {
      name: 'resume-storage',
    }
  )
)

