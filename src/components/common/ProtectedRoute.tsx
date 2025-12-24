import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Box, Typography, CircularProgress } from '@mui/material'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'Admin' | 'Regular User'
  allowedRoles?: string[]
}

const ProtectedRoute = ({ children, requiredRole, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, authData } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If role check is required
  if (requiredRole || allowedRoles) {
    const userRole = authData?.user?.role?.name || ''
    
    if (requiredRole && userRole !== requiredRole) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have permission to access this page.
          </Typography>
        </Box>
      )
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have permission to access this page.
          </Typography>
        </Box>
      )
    }
  }

  return <>{children}</>
}

export default ProtectedRoute

