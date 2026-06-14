import { useEffect, useState } from 'react'
import { useSocket } from './useSocket'
import type {
  Room,
  RoomCreatedPayload,
  RoomJoinedPayload,
  RoomUpdatedPayload,
  JoinErrorPayload,
} from '@double-six/shared'

export function useRoom() {
  const { socket } = useSocket()
  const [room, setRoom] = useState<Room | null>(null)
  const [mySeatNumber, setMySeatNumber] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!socket) return

    const onRoomCreated = (payload: RoomCreatedPayload) => {
      setMySeatNumber(payload.seatNumber)
      setError(null)
    }
    const onRoomJoined = (payload: RoomJoinedPayload) => {
      setRoom(payload.room)
      setError(null)
    }
    const onRoomUpdated = (payload: RoomUpdatedPayload) => {
      setRoom(payload.room)
    }
    const onJoinError = (payload: JoinErrorPayload) => {
      setError(payload.message)
    }

    socket.on('room_created', onRoomCreated)
    socket.on('room_joined', onRoomJoined)
    socket.on('room_updated', onRoomUpdated)
    socket.on('join_error', onJoinError)

    return () => {
      socket.off('room_created', onRoomCreated)
      socket.off('room_joined', onRoomJoined)
      socket.off('room_updated', onRoomUpdated)
      socket.off('join_error', onJoinError)
    }
  }, [socket])

  function createRoom() {
    socket?.emit('create_room')
  }

  function joinRoom(code: string) {
    socket?.emit('join_room', { code })
  }

  function pickSeat(seatNumber: number) {
    socket?.emit('pick_seat', { seatNumber })
  }

  function movePlayer(playerId: string, seatNumber: number) {
    socket?.emit('move_player', { playerId, seatNumber })
  }

  return { room, mySeatNumber, error, createRoom, joinRoom, pickSeat, movePlayer }
}
