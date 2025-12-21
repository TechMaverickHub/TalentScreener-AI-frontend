import { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, LinearProgress, Chip, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { MatchResult } from '@/services/api/matchingApi'

const ResultsPage = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState<MatchResult[]>([])

  useEffect(() => {
    const storedResults = sessionStorage.getItem('matchResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      navigate('/match')
    }
  }, [navigate])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  if (results.length === 0) {
    return (
      <Box>
        <Typography variant="h4">No results found</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Match Results
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Found {results.length} matching job{results.length !== 1 ? 's' : ''}
      </Typography>

      <Grid container spacing={3}>
        {results.map((result, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5">{result.job.title}</Typography>
                  <Chip
                    label={`${result.match_score}% Match`}
                    color={getScoreColor(result.match_score)}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Match Score
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={result.match_score}
                    color={getScoreColor(result.match_score)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

                {result.matched_skills.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Matched Skills ({result.matched_skills.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {result.matched_skills.map((skill, idx) => (
                        <Chip key={idx} label={skill} color="success" size="small" />
                      ))}
                    </Box>
                  </Box>
                )}

                {result.missing_skills.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Missing Skills ({result.missing_skills.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {result.missing_skills.map((skill, idx) => (
                        <Chip key={idx} label={skill} color="error" size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                <Typography variant="body2" color="text.secondary">
                  Experience Match: {result.experience_match ? 'Yes' : 'No'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ResultsPage

