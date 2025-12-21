import { Box, Typography } from '@mui/material'
import { useJobStore } from '@/store/jobStore'
import JobCard from './JobCard'

const JobList = () => {
  const jobs = useJobStore((state) => state.jobs)

  if (jobs.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Posted Jobs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No jobs posted yet. Post your first job to get started.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Posted Jobs ({jobs.length})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </Box>
    </Box>
  )
}

export default JobList

