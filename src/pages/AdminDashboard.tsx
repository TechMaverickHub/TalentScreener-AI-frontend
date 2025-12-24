import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Paper } from '@mui/material'
import { PostAdd } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useJobStore } from '@/store/jobStore'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { authData } = useAuthStore()
  const { jobs } = useJobStore()

  const adminActions = [
    {
      title: 'Upload Job',
      description: 'Upload a new job description. Our AI will parse it to extract requirements, skills, and qualifications.',
      icon: <PostAdd sx={{ fontSize: 40 }} />,
      link: '/job/post',
      color: '#1976d2',
    },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {authData?.user?.first_name}! Upload job descriptions to find the best matching candidates.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
        {adminActions.map((action) => (
          <Grid item xs={12} md={6} sm={8} key={action.title}>
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
          Job Posting Statistics
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="h4" color="primary">
                {jobs.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Jobs Posted
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="h4" color="secondary">
                {jobs.reduce((acc, job) => acc + (job.parsed_data?.skills?.length || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Skills Required
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="h4" color="success.main">
                {new Set(jobs.map(j => j.parsed_data?.skills || []).flat()).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Skills
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default AdminDashboard

