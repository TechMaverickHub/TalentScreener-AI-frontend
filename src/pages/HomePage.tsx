import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { Upload, Work, Search } from '@mui/icons-material'

const HomePage = () => {
  const features = [
    {
      title: 'Upload Resume',
      description: 'Upload your resume and let AI parse it to extract skills, experience, and qualifications.',
      icon: <Upload sx={{ fontSize: 40 }} />,
      link: '/resume/upload',
      color: '#1976d2',
    },
    {
      title: 'Post Job',
      description: 'Post a job description and get it parsed to find the best matching candidates.',
      icon: <Work sx={{ fontSize: 40 }} />,
      link: '/job/post',
      color: '#dc004e',
    },
    {
      title: 'Match Resume',
      description: 'Match your resume against available jobs and see compatibility scores.',
      icon: <Search sx={{ fontSize: 40 }} />,
      link: '/match',
      color: '#2e7d32',
    },
  ]

  return (
    <Box sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 2, fontWeight: 600 }}>
        Talent Screen
      </Typography>
      <Typography variant="h6" component="p" color="text.secondary" align="center" sx={{ mb: 8 }}>
        AI-powered job resume matching platform
      </Typography>

      <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {features.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
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
              component={Link}
              to={feature.link}
              style={{ textDecoration: 'none' }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                <Box sx={{ color: feature.color, mb: 3, display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ 
                    backgroundColor: feature.color,
                    px: 4,
                    '&:hover': {
                      backgroundColor: feature.color,
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
    </Box>
  )
}

export default HomePage

