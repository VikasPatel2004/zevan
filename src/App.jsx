import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DiscoveryPage from './pages/DiscoveryPage'
import MessDetailsPage from './pages/MessDetailsPage'
import StudentDashboard from './pages/StudentDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import LoginPage from './pages/LoginPage'
import { ROUTES } from './routes/routes'

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.DISCOVER} element={<DiscoveryPage />} />
      <Route path={ROUTES.MESS_DETAILS} element={<MessDetailsPage />} />
      <Route path={ROUTES.STUDENT} element={<StudentDashboard />} />
      <Route path={ROUTES.OWNER} element={<OwnerDashboard />} />
    </Routes>
  )
}

export default App
