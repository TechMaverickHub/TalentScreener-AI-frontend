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
import { login } from '@/services/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { LoginCredentials } from '@/types/auth.types'
import Loading from '@/components/common/Loading'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login: setAuth } = useAuthStore()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginCredentials, string>>>({})

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data)
      navigate('/')
    },
  })

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoginCredentials, string>> = {}

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
      loginMutation.mutate(formData)
    }
  }

  const handleChange = (field: keyof LoginCredentials) => (
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
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to your account to continue
          </Typography>

          {loginMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : 'Login failed. Please check your credentials and try again.'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
            />

            {loginMutation.isPending && <Loading message="Logging in..." />}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loginMutation.isPending}
            >
              Sign In
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <MuiLink component={Link} to="/register" underline="hover">
                  Sign up here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginPage

