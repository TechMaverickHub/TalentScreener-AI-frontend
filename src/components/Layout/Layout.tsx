import { ReactNode } from 'react'
import { AppBar, Toolbar, Typography, Container, Box, Button, Menu, MenuItem } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Work, Description, Search, AccountCircle } from '@mui/icons-material'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, authData, logout } = useAuthStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Get user role
  const userRole = authData?.user?.role?.name || ''
  // Check if user is admin (Admin or Super Admin)
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin'
  const isRegularUser = userRole === 'Regular User'

  // Define navigation items based on role
  const getNavItems = () => {
    if (!isAuthenticated) {
      return [{ path: '/', label: 'Home', icon: <Work /> }]
    }

    if (isAdmin) {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <Work /> },
        { path: '/job/post', label: 'Upload Job', icon: <Work /> },
      ]
    }

    if (isRegularUser) {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: <Work /> },
        { path: '/resume/upload', label: 'Upload Resume', icon: <Description /> },
        { path: '/match', label: 'Match Resume', icon: <Search /> },
      ]
    }

    return [{ path: '/', label: 'Home', icon: <Work /> }]
  }

  const navItems = getNavItems()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Talent Screen
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor:
                    location.pathname === item.path
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'transparent',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {isAuthenticated && authData ? (
              <>
                <Button
                  color="inherit"
                  onClick={handleMenuOpen}
                  startIcon={<AccountCircle />}
                  sx={{ ml: 2 }}
                >
                  {authData.user.first_name} {authData.user.last_name}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {authData.user.email}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Talent Screen - Job Resume Matcher
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout

