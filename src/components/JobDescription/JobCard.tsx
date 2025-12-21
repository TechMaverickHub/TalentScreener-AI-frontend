import { Card, CardContent, CardActions, Typography, Button, Box, Chip, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { JobData } from '@/types/job.types'
import { useJobStore } from '@/store/jobStore'

interface JobCardProps {
  job: JobData
}

const JobCard = ({ job }: JobCardProps) => {
  const removeJob = useJobStore((state) => state.removeJob)

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      removeJob(job.id!)
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {job.title}
        </Typography>
        {job.created_at && (
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Posted: {new Date(job.created_at).toLocaleDateString()}
          </Typography>
        )}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Required Experience: {job.parsed_data.years_of_experience} years
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {job.parsed_data.skills.slice(0, 10).map((skill, index) => (
              <Chip key={index} label={skill} size="small" variant="outlined" />
            ))}
            {job.parsed_data.skills.length > 10 && (
              <Chip label={`+${job.parsed_data.skills.length - 10} more`} size="small" />
            )}
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {job.parsed_data.technical_experience.substring(0, 200)}...
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined">
          View Details
        </Button>
        <IconButton size="small" color="error" onClick={handleDelete}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default JobCard

