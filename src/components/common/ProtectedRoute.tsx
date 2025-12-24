import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Box, Typography } from '@mui/material'
import { isAdminRole } from '@/utils/authHelpers'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'Admin' | 'Regular User' | 'Super Admin'
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
    
    if (requiredRole) {
      // Handle Admin role - check for both Admin and Super Admin
      if (requiredRole === 'Admin') {
        if (!isAdminRole(userRole)) {
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
      } else if (userRole !== requiredRole) {
        // For other roles, exact match required
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

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Check if user is admin and allowedRoles includes any admin role
      const hasAdminAccess = isAdminRole(userRole) && allowedRoles.some(role => isAdminRole(role))
      if (!hasAdminAccess) {
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
  }

  return <>{children}</>
}

export default ProtectedRoute

