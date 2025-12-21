import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { JobData } from '@/types/job.types'

interface JobState {
  jobs: JobData[]
  selectedJob: JobData | null
  addJob: (job: JobData) => void
  updateJob: (id: string, job: JobData) => void
  removeJob: (id: string) => void
  selectJob: (id: string) => void
  clearSelectedJob: () => void
}

export const useJobStore = create<JobState>()(
  persist(
    (set) => ({
      jobs: [],
      selectedJob: null,
      addJob: (job) => {
        const newJob: JobData = {
          ...job,
          id: job.id || Date.now().toString(),
          created_at: job.created_at || new Date().toISOString(),
        }
        set((state) => ({
          jobs: [...state.jobs, newJob],
        }))
      },
      updateJob: (id, updatedJob) => {
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id
              ? { ...updatedJob, id, updated_at: new Date().toISOString() }
              : job
          ),
          selectedJob:
            state.selectedJob?.id === id
              ? { ...updatedJob, id, updated_at: new Date().toISOString() }
              : state.selectedJob,
        }))
      },
      removeJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
          selectedJob: state.selectedJob?.id === id ? null : state.selectedJob,
        }))
      },
      selectJob: (id) => {
        set((state) => ({
          selectedJob: state.jobs.find((job) => job.id === id) || null,
        }))
      },
      clearSelectedJob: () => {
        set({ selectedJob: null })
      },
    }),
    {
      name: 'job-storage',
    }
  )
)

