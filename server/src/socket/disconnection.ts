import { Server, Socket } from 'socket.io'
import { rooms } from '../store/rooms'
import { matchStore, handStore } from './lobby'
import { emitPlayerViews } from '../game/state'
import { getValidTiles, applyPlacement, nextSeatClockwise } from '../game/rules'
import { Tile } from '@double-six/shared'

export function registerDisconnectionHandlers(io: Server, socket: Socket) {
  socket.on('disconnect', () => {
    const playerId = socket.data.playerId as string | undefined
    const code = socket.data.roomCode as string | undefined

    if (!playerId || !code) return

    const room = rooms.get(code)
    if (!room) return

    const seat = room.seats.find((s) => s.playerId === playerId)
    if (!seat) return

    seat.connected = false

    if (room.status === 'lobby') {
      io.to(code).emit('room_updated', { room })
      return
    }

    if (room.status === 'in_game') {
      room.status = 'paused'
      io.to(code).emit('player_disconnected', {
        seatNumber: seat.seatNumber,
        playerName: seat.playerName,
      })
    }

    if (room.hostId === playerId) {
      const nextHost = room.joinOrder.find((id) => {
        if (id === playerId) return false
        const s = room.seats.find((s) => s.playerId === id)
        return s?.connected
      })
      if (nextHost) {
        room.hostId = nextHost
        const nextHostSeat = room.seats.find((s) => s.playerId === nextHost)
        io.to(code).emit('host_changed', {
          newHostId: nextHost,
          playerName: nextHostSeat?.playerName ?? '?',
        })
      }
    }
  })

  socket.on('host_decision', (payload: { decision: 'wait' | 'continue' | 'end' }) => {
    const playerId = socket.data.playerId as string
    const code = socket.data.roomCode as string
    const room = rooms.get(code)

    if (!room) return
    if (room.hostId !== playerId) return

    if (payload.decision === 'wait') return

    if (payload.decision === 'end') {
      room.status = 'finished'
      rooms.delete(code)
      matchStore.delete(code)
      handStore.delete(code)
      io.to(code).emit('game_ended', { reason: 'host_ended' })
      return
    }

    if (payload.decision === 'continue') {
      room.seats.forEach((s) => {
        if (!s.connected) s.autoPlay = true
      })
      room.status = 'in_game'

      const match = matchStore.get(code)
      const hand = handStore.get(code)
      if (!match || !hand) return

      emitPlayerViews(io, room, match, hand, 'state_updated')
      scheduleAutoPlayIfNeeded(io, code)
    }
  })
}

export function handleReconnection(io: Server, socket: Socket) {
  const playerId = socket.data.playerId as string
  const code = socket.data.roomCode as string | undefined
  if (!code) return

  const room = rooms.get(code)
  if (!room) return

  const seat = room.seats.find((s) => s.playerId === playerId)
  if (!seat) return

  seat.connected = true
  seat.autoPlay = false

  const match = matchStore.get(code)
  const hand = handStore.get(code)

  const stillDisconnected = room.seats.some((s) => s.playerId && !s.connected)

  if (!stillDisconnected && room.status === 'paused') {
    room.status = 'in_game'
  }

  io.to(code).emit('player_reconnected', {
    seatNumber: seat.seatNumber,
    playerName: seat.playerName,
  })

  if (match && hand) {
    emitPlayerViews(io, room, match, hand, 'state_updated')
  }
}

export function scheduleAutoPlayIfNeeded(io: Server, code: string) {
  const room = rooms.get(code)
  const match = matchStore.get(code)
  const hand = handStore.get(code)

  if (!room || !match || !hand) return
  if (room.status !== 'in_game') return

  const currentSeat = room.seats.find((s) => s.seatNumber === hand.currentTurnSeat)
  if (!currentSeat?.autoPlay) return

  setTimeout(() => {
    const room = rooms.get(code)
    const match = matchStore.get(code)
    const hand = handStore.get(code)

    if (!room || !match || !hand) return
    if (room.status !== 'in_game') return

    const playerTiles = hand.playerTiles[hand.currentTurnSeat]
    const validTiles = getValidTiles(playerTiles, hand)

    if (validTiles.length === 0) {
      hand.currentTurnSeat = nextSeatClockwise(hand.currentTurnSeat)
      emitPlayerViews(io, room, match, hand, 'state_updated')
    } else {
      const tile = validTiles[0]
      const orientation = getAutoPlayOrientation(tile, hand.openEnds)

      io.to(code).emit('auto_play', {
        seatNumber: hand.currentTurnSeat,
        tile,
        orientation,
      })

      setTimeout(() => {
        applyPlacement(tile, orientation, hand.currentTurnSeat, hand)
        hand.currentTurnSeat = nextSeatClockwise(hand.currentTurnSeat)
        emitPlayerViews(io, room, match, hand, 'state_updated')
        scheduleAutoPlayIfNeeded(io, code)
      }, 1500)
    }
  }, 1500)
}

function getAutoPlayOrientation(
  tile: Tile,
  openEnds: { left: number; right: number }
): 'normal' | 'flipped' {
  if (openEnds.left === -1) return 'normal'
  if (tile.left === openEnds.right) return 'normal'
  if (tile.right === openEnds.right) return 'flipped'
  if (tile.right === openEnds.left) return 'normal'
  if (tile.left === openEnds.left) return 'flipped'
  return 'normal'
}
