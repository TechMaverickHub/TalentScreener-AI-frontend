import { Box, Typography, Grid, Card, CardContent, CardActions, Button, IconButton } from '@mui/material'
import { Delete, Visibility } from '@mui/icons-material'
import { useResumeStore } from '@/store/resumeStore'
import ResumeDataDisplay from '@/components/ResumeUpload/ResumeDataDisplay'
import { useState } from 'react'

const ResumeListPage = () => {
  const { resumes, removeResume, selectResume, selectedResume } = useResumeStore()
  const [viewingResume, setViewingResume] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      removeResume(id)
      if (viewingResume === id) {
        setViewingResume(null)
      }
    }
  }

  const handleView = (id: string) => {
    setViewingResume(id)
    selectResume(id)
  }

  if (resumes.length === 0) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Resumes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No resumes uploaded yet. Upload your first resume to get started.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Resumes
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your uploaded resumes
      </Typography>

      <Grid container spacing={3}>
        {resumes.map((resume) => (
          <Grid item xs={12} md={6} key={resume.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {resume.filename}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Experience: {resume.years_of_experience} years
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Skills: {resume.skills.length} skills
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<Visibility />}
                  onClick={() => handleView(resume.id)}
                  variant="outlined"
                >
                  View Details
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(resume.id)}
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {viewingResume && selectedResume && (
        <Box sx={{ mt: 4 }}>
          <ResumeDataDisplay resumeData={selectedResume} />
        </Box>
      )}
    </Box>
  )
}

export default ResumeListPage

