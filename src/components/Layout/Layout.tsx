import { ReactNode } from 'react'
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { Work, Description, Search } from '@mui/icons-material'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: <Work /> },
    { path: '/resume/upload', label: 'Upload Resume', icon: <Description /> },
    { path: '/job/post', label: 'Post Job', icon: <Work /> },
    { path: '/match', label: 'Match Resume', icon: <Search /> },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Talent Screen
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
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

