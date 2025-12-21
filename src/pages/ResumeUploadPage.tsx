import { useState } from 'react'
import { Box, Typography, Alert } from '@mui/material'
import ResumeUploadForm from '@/components/ResumeUpload/ResumeUploadForm'
import ResumeDataDisplay from '@/components/ResumeUpload/ResumeDataDisplay'
import { useResumeUpload } from '@/hooks/useResumeUpload'
import Loading from '@/components/common/Loading'

const ResumeUploadPage = () => {
  const [uploadedResume, setUploadedResume] = useState<any>(null)
  const uploadMutation = useResumeUpload()

  const handleUploadSuccess = (data: any) => {
    setUploadedResume(data.resumeData)
  }

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error)
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Resume
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Upload your resume in PDF format. Our AI will parse it and extract your skills, experience, and qualifications.
      </Typography>

      {uploadMutation.isPending && <Loading message="Uploading and parsing resume..." />}

      {uploadMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {uploadMutation.error?.message || 'Failed to upload resume. Please try again.'}
        </Alert>
      )}

      {uploadMutation.isSuccess && uploadedResume && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Resume uploaded and parsed successfully!
        </Alert>
      )}

      {!uploadMutation.isPending && (
        <>
          <ResumeUploadForm
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            mutation={uploadMutation}
          />
          {uploadedResume && (
            <Box sx={{ mt: 4 }}>
              <ResumeDataDisplay resumeData={uploadedResume} />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default ResumeUploadPage

