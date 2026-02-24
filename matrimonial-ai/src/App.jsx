import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfileCreate from './pages/ProfileCreate'
import Preferences from './pages/Preferences'
import Matches from './pages/Matches'
import ProfileDetails from './pages/ProfileDetails'
import Chat from './pages/Chat'
import MeetingPlanner from './pages/MeetingPlanner'
import Settings from './pages/Settings'
import GuardianMode from './pages/GuardianMode'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Routes>
      {/* Public + Main routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/profile/:id" element={<ProfileDetails />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/meetings" element={<MeetingPlanner />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/guardian" element={<GuardianMode />} />
        <Route path="/preferences" element={<Preferences />} />
      </Route>
      
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/create" element={<ProfileCreate />} />
      </Route>
      
      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
