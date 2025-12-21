import { useCallback, useState } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'
import { validatePDFFile } from '@/utils/helpers'
import { UseMutationResult } from '@tanstack/react-query'

interface ResumeUploadFormProps {
  onUploadSuccess: (data: any) => void
  onUploadError: (error: Error) => void
  mutation: UseMutationResult<any, Error, { file: File; filename: string }>
}

const ResumeUploadForm = ({
  onUploadSuccess,
  onUploadError,
  mutation,
}: ResumeUploadFormProps) => {
  const [fileError, setFileError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      const validation = validatePDFFile(file)

      if (!validation.valid) {
        setFileError(validation.error || 'Invalid file')
        return
      }

      setFileError(null)
      try {
        const result = await mutation.mutateAsync({
          file,
          filename: file.name,
        })
        onUploadSuccess(result)
      } catch (error) {
        onUploadError(error as Error)
      }
    },
    [mutation, onUploadSuccess, onUploadError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  return (
    <Paper
      sx={{
        p: 4,
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.300',
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main' }} />
        <Typography variant="h6">
          {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to browse
        </Typography>
        <Typography variant="caption" color="text.secondary">
          PDF files only, max 10MB
        </Typography>
        {fileError && (
          <Typography variant="body2" color="error">
            {fileError}
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

export default ResumeUploadForm

