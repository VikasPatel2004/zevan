import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DiscoveryPage from './pages/DiscoveryPage'
import MessDetailsPage from './pages/MessDetailsPage'
import StudentDashboard from './pages/StudentDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/discover" element={<DiscoveryPage />} />
      <Route path="/messes/:id" element={<MessDetailsPage />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/owner" element={<OwnerDashboard />} />
    </Routes>
  )
}

export default App
