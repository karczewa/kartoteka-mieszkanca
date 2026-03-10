import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import MieszkancyPage from './pages/MieszkancyPage'
import ObywatelPage from './pages/ObywatelPage'
import RejestrPage from './pages/RejestrPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/mieszkancy" replace />} />
          <Route path="/mieszkancy" element={<MieszkancyPage />} />
          <Route path="/mieszkancy/:id" element={<ObywatelPage />} />
          <Route path="/rejestr" element={<RejestrPage />} />
        </Routes>
      </main>
    </div>
  )
}
