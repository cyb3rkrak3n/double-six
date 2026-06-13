import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useSocket } from '../hooks/useSocket'
import { RoomCodeDisplay } from '../components/lobby/RoomCodeDisplay'
import { SeatingArea } from '../components/lobby/SeatingArea'

export function LobbyPage() {
  const { code } = useParams<{ code: string }>()
  const { playerId, registered } = useSocket()
  const { room, joinRoom, pickSeat, movePlayer } = useRoom()

  useEffect(() => {
    if (registered && code && !room) {
      joinRoom(code)
    }
  }, [registered, code, room])

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
    </div>
  )
}
