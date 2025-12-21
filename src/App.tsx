import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import ResumeUploadPage from './pages/ResumeUploadPage'
import ResumeListPage from './pages/ResumeListPage'
import JobPostingPage from './pages/JobPostingPage'
import JobListPage from './pages/JobListPage'
import MatchingPage from './pages/MatchingPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume/upload" element={<ResumeUploadPage />} />
          <Route path="/resume/list" element={<ResumeListPage />} />
          <Route path="/job/post" element={<JobPostingPage />} />
          <Route path="/job/list" element={<JobListPage />} />
          <Route path="/match" element={<MatchingPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

