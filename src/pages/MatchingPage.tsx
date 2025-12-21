import { useState } from 'react'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material'
import { useResumeStore } from '@/store/resumeStore'
import { useResumeMatching } from '@/hooks/useResumeMatching'
import Loading from '@/components/common/Loading'
import { useNavigate } from 'react-router-dom'

const MatchingPage = () => {
  const navigate = useNavigate()
  const { resumes, selectResume } = useResumeStore()
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const matchMutation = useResumeMatching()

  const handleMatch = async () => {
    const resume = resumes.find((r) => r.id === selectedResumeId)
    if (!resume) return

    try {
      const results = await matchMutation.mutateAsync(resume)
      // Store results temporarily (you might want to use a store for this)
      sessionStorage.setItem('matchResults', JSON.stringify(results))
      navigate('/results')
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (resumes.length === 0) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Match Resume to Jobs
        </Typography>
        <Alert severity="info">
          No resumes uploaded yet. Please upload a resume first.
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Match Resume to Jobs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select a resume to match against available job postings
      </Typography>

      <Box sx={{ maxWidth: 500, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Select Resume</InputLabel>
          <Select
            value={selectedResumeId}
            label="Select Resume"
            onChange={(e) => {
              setSelectedResumeId(e.target.value)
              selectResume(e.target.value)
            }}
          >
            {resumes.map((resume) => (
              <MenuItem key={resume.id} value={resume.id}>
                {resume.filename} ({resume.years_of_experience} years exp.)
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {matchMutation.isPending && <Loading message="Matching resume to jobs..." />}

      {matchMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {matchMutation.error?.message || 'Failed to match resume. Please try again.'}
        </Alert>
      )}

      <Button
        variant="contained"
        size="large"
        onClick={handleMatch}
        disabled={!selectedResumeId || matchMutation.isPending}
      >
        Find Matching Jobs
      </Button>
    </Box>
  )
}

export default MatchingPage

