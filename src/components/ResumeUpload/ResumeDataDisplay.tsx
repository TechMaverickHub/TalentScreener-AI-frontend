import { Box, Typography, Paper, Chip, Divider } from '@mui/material'
import { ResumeData } from '@/types/resume.types'

interface ResumeDataDisplayProps {
  resumeData: ResumeData
}

const ResumeDataDisplay = ({ resumeData }: ResumeDataDisplayProps) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Parsed Resume Data
      </Typography>

      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Years of Experience
        </Typography>
        <Typography variant="body1">{resumeData.years_of_experience} years</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Skills
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {resumeData.skills.map((skill, index) => (
            <Chip key={index} label={skill} color="primary" variant="outlined" />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Technical Experience
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resumeData.technical_experience}
        </Typography>
      </Box>

      {resumeData.summary && (
        <>
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {resumeData.summary}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  )
}

export default ResumeDataDisplay

