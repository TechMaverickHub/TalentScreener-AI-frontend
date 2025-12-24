import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ResumeUploadPage from './pages/ResumeUploadPage'
import ResumeListPage from './pages/ResumeListPage'
import JobPostingPage from './pages/JobPostingPage'
import JobListPage from './pages/JobListPage'
import MatchingPage from './pages/MatchingPage'
import ResultsPage from './pages/ResultsPage'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume/upload"
                  element={
                    <ProtectedRoute requiredRole="Regular User">
                      <ResumeUploadPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume/list"
                  element={
                    <ProtectedRoute requiredRole="Regular User">
                      <ResumeListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/job/post"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <JobPostingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/job/list"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <JobListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/match"
                  element={
                    <ProtectedRoute requiredRole="Regular User">
                      <MatchingPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/results" element={<ResultsPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

