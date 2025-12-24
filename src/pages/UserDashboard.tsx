import { useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Paper } from '@mui/material'
import { Upload, Search, Description } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useResumeStore } from '@/store/resumeStore'

const UserDashboard = () => {
  const navigate = useNavigate()
  const { authData } = useAuthStore()
  const { resumes } = useResumeStore()

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Upload your resume in PDF format. Our AI will parse it and extract your skills, experience, and qualifications.',
      icon: <Upload sx={{ fontSize: 40 }} />,
      link: '/resume/upload',
      color: '#1976d2',
    },
    {
      title: 'My Resumes',
      description: `View and manage your uploaded resumes. You have ${resumes.length} resume${resumes.length !== 1 ? 's' : ''} uploaded.`,
      icon: <Description sx={{ fontSize: 40 }} />,
      link: '/resume/list',
      color: '#2e7d32',
    },
    {
      title: 'Find Matching Jobs',
      description: 'Match your resume against available job postings and see compatibility scores.',
      icon: <Search sx={{ fontSize: 40 }} />,
      link: '/match',
      color: '#dc004e',
    },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {authData?.user?.first_name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your resumes and find the perfect job match
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid item xs={12} md={4} key={action.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(action.link)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                <Box sx={{ color: action.color, mb: 3, display: 'flex', justifyContent: 'center' }}>
                  {action.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: action.color,
                    px: 4,
                    '&:hover': {
                      backgroundColor: action.color,
                      opacity: 0.9,
                    },
                  }}
                >
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Stats
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="h4" color="primary">
                {resumes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Uploaded Resumes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="h4" color="secondary">
                {resumes.filter(r => r.years_of_experience >= 3).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3+ Years Experience
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="h4" color="success.main">
                {resumes.reduce((acc, r) => acc + (r.skills?.length || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Skills
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default UserDashboard

