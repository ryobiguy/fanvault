import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import CreatorDashboard from './pages/CreatorDashboard'
import FanDashboard from './pages/FanDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreatorProfile from './pages/CreatorProfile'
import Messages from './pages/Messages'
import UploadContent from './pages/UploadContent'
import Explore from './pages/Explore'
import EditProfile from './pages/EditProfile'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/fan/dashboard" element={<FanDashboard />} />
          <Route path="/creator/:username" element={<CreatorProfile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/upload" element={<UploadContent />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
