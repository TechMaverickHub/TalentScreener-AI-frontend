import { useForm } from 'react-hook-form'
import { Box, TextField, Button, Paper, Typography } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import { JobInput } from '@/types/job.types'

interface JobFormProps {
  mutation: UseMutationResult<any, Error, JobInput>
}

const JobForm = ({ mutation }: JobFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobInput>()

  const onSubmit = async (data: JobInput) => {
    try {
      await mutation.mutateAsync(data)
      reset()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        New Job Posting
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('title', { required: 'Job title is required' })}
          label="Job Title"
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          {...register('description', { required: 'Job description is required' })}
          label="Job Description"
          fullWidth
          multiline
          rows={8}
          margin="normal"
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Posting...' : 'Post Job'}
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default JobForm

