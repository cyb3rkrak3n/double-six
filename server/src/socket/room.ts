import { Server, Socket } from 'socket.io'
import { Room, JoinRoomPayload, PickSeatPayload, MovePlayerPayload, JoinErrorPayload, RoomCreatedPayload } from '@double-six/shared'
import { rooms, generateRoomCode, createEmptySeats } from '../store/rooms'

export function registerRoomHandlers(io: Server, socket: Socket) {
  socket.on('create_room', () => {
    const playerId = socket.data.playerId as string
    const playerName = socket.data.playerName as string

    const code = generateRoomCode()
    const seats = createEmptySeats()
    seats[0] = {
      seatNumber: 1,
      playerId,
      playerName,
      connected: true,
      autoPlay: false,
    }

    const room: Room = {
      code,
      hostId: playerId,
      status: 'lobby',
      joinOrder: [playerId],
      seats,
    }

    rooms.set(code, room)
    socket.join(code)
    socket.data.roomCode = code

    const response: RoomCreatedPayload = { code, seatNumber: 1 }
    socket.emit('room_created', response)
    io.to(code).emit('room_updated', { room })
  })

  socket.on('join_room', (payload: JoinRoomPayload) => {
    const playerId = socket.data.playerId as string
    const playerName = socket.data.playerName as string

    const room = rooms.get(payload.code)

    if (!room) {
      const error: JoinErrorPayload = { message: 'Room not found' }
      socket.emit('join_error', error)
      return
    }

    if (room.status !== 'lobby') {
      const error: JoinErrorPayload = { message: 'Game already started' }
      socket.emit('join_error', error)
      return
    }

    const alreadySeated = room.seats.find((s) => s.playerId === playerId)
    if (!alreadySeated) {
      const emptySeat = room.seats.find((s) => s.playerId === null)
      if (!emptySeat) {
        const error: JoinErrorPayload = { message: 'Room is full' }
        socket.emit('join_error', error)
        return
      }
      emptySeat.playerId = playerId
      emptySeat.playerName = playerName
      emptySeat.connected = true
      room.joinOrder.push(playerId)
    } else {
      alreadySeated.connected = true
    }

    socket.join(payload.code)
    socket.data.roomCode = payload.code

    socket.emit('room_joined', { room })
    io.to(payload.code).emit('room_updated', { room })
  })

  socket.on('pick_seat', (payload: PickSeatPayload) => {
    const room = getCurrentRoom(socket)
    if (!room) return

    const playerId = socket.data.playerId as string
    const playerName = socket.data.playerName as string

    const targetSeat = room.seats.find((s) => s.seatNumber === payload.seatNumber)
    if (!targetSeat || targetSeat.playerId !== null) return

    const currentSeat = room.seats.find((s) => s.playerId === playerId)
    if (currentSeat) {
      currentSeat.playerId = null
      currentSeat.playerName = null
      currentSeat.connected = false
    }

    targetSeat.playerId = playerId
    targetSeat.playerName = playerName
    targetSeat.connected = true

    io.to(room.code).emit('room_updated', { room })
  })

  socket.on('move_player', (payload: MovePlayerPayload) => {
    const room = getCurrentRoom(socket)
    if (!room) return

    const playerId = socket.data.playerId as string
    if (room.hostId !== playerId) return

    const targetSeat = room.seats.find((s) => s.seatNumber === payload.seatNumber)
    if (!targetSeat || targetSeat.playerId !== null) return

    const movingSeat = room.seats.find((s) => s.playerId === payload.playerId)
    if (!movingSeat) return

    targetSeat.playerId = movingSeat.playerId
    targetSeat.playerName = movingSeat.playerName
    targetSeat.connected = movingSeat.connected

    movingSeat.playerId = null
    movingSeat.playerName = null
    movingSeat.connected = false

    io.to(room.code).emit('room_updated', { room })
  })
}

function getCurrentRoom(socket: Socket): Room | undefined {
  const code = socket.data.roomCode as string | undefined
  if (!code) return undefined
  return rooms.get(code)
}
