import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useSocket } from '../hooks/useSocket'
import { RoomCodeDisplay } from '../components/lobby/RoomCodeDisplay'
import { SeatingArea } from '../components/lobby/SeatingArea'
import { LobbyControls } from '../components/lobby/LobbyControls'

export function LobbyPage() {
  const { code } = useParams<{ code: string }>()
  const { playerId, registered, socket } = useSocket()
  const { room, joinRoom, pickSeat, movePlayer } = useRoom()
  const [startError, setStartError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (registered && code && !room) {
      joinRoom(code)
    }
  }, [registered, code, room])

  useEffect(() => {
    if (!socket) return

    const onGameStarted = () => {
      navigate(`/game/${code}`)
    }
    const onStartError = (payload: { message: string }) => {
      setStartError(payload.message)
    }

    socket.on('game_started', onGameStarted)
    socket.on('start_error', onStartError)

    return () => {
      socket.off('game_started', onGameStarted)
      socket.off('start_error', onStartError)
    }
  }, [socket, code, navigate])

  function handleStartGame() {
    setStartError(null)
    socket?.emit('start_game')
  }

  if (!room) return <div>Loading lobby...</div>

  return (
    <div>
      <h1>Lobby</h1>
      <RoomCodeDisplay code={room.code} />
      <SeatingArea
        room={room}
        myPlayerId={playerId}
        onSit={pickSeat}
        onMove={movePlayer}
      />
      <LobbyControls
        room={room}
        myPlayerId={playerId}
        onStartGame={handleStartGame}
        startError={startError}
      />
    </div>
  )
}
