import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { register } from '@/services/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { RegisterCredentials } from '@/types/auth.types'
import Loading from '@/components/common/Loading'

const RegistrationPage = () => {
  const navigate = useNavigate()
  const { login: setAuth } = useAuthStore()
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterCredentials, string>>>({})

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data)
      navigate('/')
    },
  })

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterCredentials, string>> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      registerMutation.mutate(formData)
    }
  }

  const handleChange = (field: keyof RegisterCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign up to get started with Talent Screen
          </Typography>

          {registerMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {registerMutation.error instanceof Error
                ? registerMutation.error.message
                : 'Registration failed. Please try again.'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                id="first_name"
                label="First Name"
                name="first_name"
                autoComplete="given-name"
                autoFocus
                value={formData.first_name}
                onChange={handleChange('first_name')}
                error={!!errors.first_name}
                helperText={errors.first_name}
              />
              <TextField
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                autoComplete="family-name"
                value={formData.last_name}
                onChange={handleChange('last_name')}
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
            />

            {registerMutation.isPending && <Loading message="Creating account..." />}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={registerMutation.isPending}
            >
              Sign Up
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" underline="hover">
                  Sign in here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default RegistrationPage

