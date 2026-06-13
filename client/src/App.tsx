import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import { HomePage } from './pages/HomePage'
import { LobbyPage } from './pages/LobbyPage'
import { GamePage } from './pages/GamePage'

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lobby/:code" element={<LobbyPage />} />
          <Route path="/game/:code" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  )
}

export default App
