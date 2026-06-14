import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import type { PlayerRegisteredPayload } from '@double-six/shared'

interface SocketContextValue {
  socket: Socket | null
  playerId: string | null
  playerName: string | null
  registered: boolean
  register: (playerName: string) => void
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined)

const TOKEN_KEY = 'double-six-token'

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [playerName, setPlayerName] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    const socket = io('http://localhost:3001')
    socketRef.current = socket

    socket.on('player_registered', (payload: PlayerRegisteredPayload) => {
      sessionStorage.setItem(TOKEN_KEY, payload.token)
      setPlayerId(payload.playerId)
      setPlayerName(payload.playerName)
      setRegistered(true)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  function register(name: string) {
    const socket = socketRef.current
    if (!socket) return
    const token = sessionStorage.getItem(TOKEN_KEY) || undefined
    socket.emit('register_player', { token, playerName: name })
  }

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, playerId, playerName, registered, register }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocketContext must be used within SocketProvider')
  return ctx
}
