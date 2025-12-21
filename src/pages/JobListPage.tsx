import { Box, Typography, TextField, Grid } from '@mui/material'
import { useState } from 'react'
import { useJobStore } from '@/store/jobStore'
import JobCard from '@/components/JobDescription/JobCard'

const JobListPage = () => {
  const jobs = useJobStore((state) => state.jobs)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.parsed_data.technical_experience.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Browse Jobs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Search and filter through available job postings
      </Typography>

      <TextField
        fullWidth
        label="Search jobs"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4 }}
      />

      {filteredJobs.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          {searchQuery ? 'No jobs found matching your search.' : 'No jobs available yet.'}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} md={6} key={job.id}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default JobListPage

