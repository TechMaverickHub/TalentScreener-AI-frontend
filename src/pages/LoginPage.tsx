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
  InputAdornment,
  IconButton,
  Snackbar,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { login } from '@/services/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { LoginCredentials } from '@/types/auth.types'
import Loading from '@/components/common/Loading'

interface ErrorResponse {
  message?: string
  status?: number
  results?: {
    detail?: string | string[]
  }
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { login: setAuth } = useAuthStore()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginCredentials, string>>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data)
      // Redirect to appropriate dashboard based on role
      const userRole = data.user?.role?.name || ''
      // Check if user is admin (Admin or Super Admin)
      if (userRole === 'Admin' || userRole === 'Super Admin') {
        navigate('/admin/dashboard', { replace: true })
      } else if (userRole === 'Regular User') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // Handle password mismatch error
      if (error.response?.status === 400) {
        const errorData = error.response.data
        const detail = errorData?.results?.detail
        
        if (detail) {
          // Handle array or string detail
          const errorMessage = Array.isArray(detail) ? detail[0] : detail
          if (errorMessage === 'Password Mismatch.' || errorMessage.includes('Password')) {
            setSnackbarMessage(errorMessage)
            setSnackbarOpen(true)
            return
          }
        }
      }
      
      // For other errors, show in alert
      const errorMessage = error.response?.data?.results?.detail
        ? (Array.isArray(error.response.data.results.detail)
            ? error.response.data.results.detail[0]
            : error.response.data.results.detail)
        : error.message || 'Login failed. Please check your credentials and try again.'
      
      setSnackbarMessage(errorMessage)
      setSnackbarOpen(true)
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

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
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
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default LoginPage

