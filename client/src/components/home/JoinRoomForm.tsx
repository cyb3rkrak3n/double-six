import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoom } from '../../hooks/useRoom'
import { useSocket } from '../../hooks/useSocket'

export function JoinRoomForm() {
  const { socket } = useSocket()
  const { joinRoom, error } = useRoom()
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!socket) return
    const onRoomJoined = (payload: { room: { code: string } }) => {
      navigate(`/lobby/${payload.room.code}`)
    }
    socket.on('room_joined', onRoomJoined)
    return () => {
      socket.off('room_joined', onRoomJoined)
    }
  }, [socket, navigate])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (code.trim()) joinRoom(code.trim().toUpperCase())
      }}
    >
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Room code"
      />
      <button type="submit">Join Room</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
