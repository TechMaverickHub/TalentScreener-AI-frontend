import { Box, Typography, Alert } from '@mui/material'
import JobForm from '@/components/JobDescription/JobForm'
import JobList from '@/components/JobDescription/JobList'
import { useJobStoreMutation } from '@/hooks/useJobStore'
import Loading from '@/components/common/Loading'

const JobPostingPage = () => {
  const storeMutation = useJobStoreMutation()

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Post Job Description
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Post a job description and our AI will parse it to extract requirements, skills, and qualifications.
      </Typography>

      {storeMutation.isPending && <Loading message="Storing and parsing job description..." />}

      {storeMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {storeMutation.error?.message || 'Failed to store job. Please try again.'}
        </Alert>
      )}

      {storeMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Job posted and parsed successfully!
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <JobForm mutation={storeMutation} />
      </Box>

      <Box>
        <JobList />
      </Box>
    </Box>
  )
}

export default JobPostingPage

