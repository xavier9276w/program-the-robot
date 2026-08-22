import { HashRouter, Routes, Route } from 'react-router-dom'
import { GamePage } from './pages/GamePage'
import { HostPage } from './pages/HostPage'

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/host" element={<HostPage />} />
      </Routes>
    </HashRouter>
  )
}
