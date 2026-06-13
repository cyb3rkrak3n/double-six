import { useNavigate } from 'react-router-dom'
import { useRoom } from '../../hooks/useRoom'
import { useSocket } from '../../hooks/useSocket'
import { useEffect } from 'react'

export function CreateRoomButton() {
  const { socket } = useSocket()
  const { createRoom } = useRoom()
  const navigate = useNavigate()

  useEffect(() => {
    if (!socket) return
    const onRoomCreated = (payload: { code: string }) => {
      navigate(`/lobby/${payload.code}`)
    }
    socket.on('room_created', onRoomCreated)
    return () => {
      socket.off('room_created', onRoomCreated)
    }
  }, [socket, navigate])

  return <button onClick={createRoom}>Create Room</button>
}
