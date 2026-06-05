import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import EpisodePage from './pages/EpisodePage'
import CreatorPage from './pages/CreatorPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <Routes>
          <Route path="/"                element={<HomePage />} />
          <Route path="/explore"         element={<ExplorePage />} />
          <Route path="/episode/:id"     element={<EpisodePage />} />
          <Route path="/creator/:wallet" element={<CreatorPage />} />
          <Route path="/upload"          element={<UploadPage />} />
          <Route path="/dashboard"       element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  )
}