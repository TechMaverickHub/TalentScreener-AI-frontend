import { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material'
import { PostAdd, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useJobStore } from '@/store/jobStore'
import { getFilteredJobRoles } from '@/services/api/jobApi'
import { JobRoleFilterParams } from '@/types/job.types'
import { ResumeData } from '@/types/resume.types'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { authData } = useAuthStore()
  const { jobs } = useJobStore()
  
  const [filterParams, setFilterParams] = useState<JobRoleFilterParams>({
    title: '',
    description: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTrigger, setSearchTrigger] = useState(0)

  const { data: filterData, isLoading: isFilterLoading, error: filterError } = useQuery({
    queryKey: ['jobRoleFilter', filterParams, currentPage, searchTrigger],
    queryFn: () => getFilteredJobRoles({ ...filterParams, page: currentPage }),
    enabled: searchTrigger > 0, // Only fetch when search is triggered
  })

  const adminActions = [
    {
      title: 'Upload Job',
      description: 'Upload a new job description. Our AI will parse it to extract requirements, skills, and qualifications.',
      icon: <PostAdd sx={{ fontSize: 40 }} />,
      link: '/job/post',
      color: '#1976d2',
    },
  ]

  const handleFilterChange = (field: 'title' | 'description') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterParams((prev) => ({ ...prev, [field]: e.target.value }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleSearch = () => {
    setSearchTrigger((prev) => prev + 1)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilterParams({ title: '', description: '' })
    setCurrentPage(1)
    setSearchTrigger(0)
  }


  const parseDescription = (description: string | ResumeData): ResumeData | null => {
    if (typeof description === 'string') {
      try {
        return JSON.parse(description) as ResumeData
      } catch {
        return null
      }
    }
    return description
  }

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

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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
                {new Set(jobs.flatMap(j => j.parsed_data?.skills || [])).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Skills
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Job Role Filter Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter Job Roles
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Search and filter job roles by title or description
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Filter by Title"
              placeholder="Enter job title..."
              value={filterParams.title}
              onChange={handleFilterChange('title')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Filter by Description"
              placeholder="Enter description keyword..."
              value={filterParams.description}
              onChange={handleFilterChange('description')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              sx={{ height: '100%' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {(filterParams.title || filterParams.description) && (
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" size="small" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Box>
        )}

        {/* Results Section */}
        {searchTrigger > 0 && (
          <Box sx={{ mt: 3 }}>
            {isFilterLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}
            {!isFilterLoading && filterError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load job roles. Please try again.
              </Alert>
            )}
            {!isFilterLoading && !filterError && filterData && filterData.results.length > 0 && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Found {filterData.count} job role(s)
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Title</strong></TableCell>
                        <TableCell><strong>Skills</strong></TableCell>
                        <TableCell><strong>Experience</strong></TableCell>
                        <TableCell><strong>Summary</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterData.results.map((job) => {
                        const parsedDesc = parseDescription(job.description)
                        const skills = parsedDesc?.skills || []
                        const experience = parsedDesc?.years_of_experience
                        const summary = parsedDesc?.summary || (typeof job.description === 'string' && !parsedDesc ? job.description.substring(0, 100) + '...' : null)

                        return (
                          <TableRow key={`${job.title}-${job.description.substring(0, 20)}`} hover>
                            <TableCell>
                              <Typography variant="body1" fontWeight="medium">
                                {job.title}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {skills.length > 0 ? (
                                  skills.slice(0, 5).map((skill) => (
                                    <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
                                  ))
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    N/A
                                  </Typography>
                                )}
                                {skills.length > 5 && (
                                  <Chip label={`+${skills.length - 5} more`} size="small" variant="outlined" />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {experience ? (
                                <Typography variant="body2">{experience}+ years</Typography>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  N/A
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {summary ? (
                                <Typography variant="body2" sx={{ maxWidth: 300 }}>
                                  {summary}
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  N/A
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {(filterData.next || filterData.previous) && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Button
                        variant="outlined"
                        disabled={!filterData.previous}
                        onClick={() => {
                          if (filterData.previous && currentPage > 1) {
                            setCurrentPage(currentPage - 1)
                            setSearchTrigger((prev) => prev + 1)
                          }
                        }}
                      >
                        Previous
                      </Button>
                      <Typography variant="body2">
                        Page {currentPage} of {filterData.count} results
                      </Typography>
                      <Button
                        variant="outlined"
                        disabled={!filterData.next}
                        onClick={() => {
                          if (filterData.next) {
                            setCurrentPage(currentPage + 1)
                            setSearchTrigger((prev) => prev + 1)
                          }
                        }}
                      >
                        Next
                      </Button>
                    </Stack>
                  </Box>
                )}
              </>
            )}
            {!isFilterLoading && !filterError && filterData?.results.length === 0 && (
              <Alert severity="info">No job roles found matching your filters.</Alert>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default AdminDashboard

