import { Server, Socket } from 'socket.io'
import { Match } from '@double-six/shared'
import { rooms } from '../store/rooms'
import { generateDeck, dealTiles } from '../game/deck'
import { ServerHandState, emitPlayerViews } from '../game/state'

export const matchStore = new Map<string, Match>()
export const handStore = new Map<string, ServerHandState>()

export function registerLobbyHandlers(io: Server, socket: Socket) {
  socket.on('start_game', () => {
    const playerId = socket.data.playerId as string
    const code = socket.data.roomCode as string
    const room = rooms.get(code)

    if (!room) return

    if (room.hostId !== playerId) {
      socket.emit('start_error', { message: 'Only the host can start the game' })
      return
    }

    const allFilled = room.seats.every((s) => s.playerId !== null)
    if (!allFilled) {
      socket.emit('start_error', { message: 'All 4 seats must be filled before starting' })
      return
    }

    const deck = generateDeck()
    const [hand1, hand2, hand3, hand4] = dealTiles(deck)

    const playerTiles: Record<number, typeof hand1> = {
      1: hand1,
      2: hand2,
      3: hand3,
      4: hand4,
    }

    let startingSeat = 1
    for (const [seatStr, tiles] of Object.entries(playerTiles)) {
      const hasDoubleSix = tiles.some((t) => t.left === 6 && t.right === 6)
      if (hasDoubleSix) {
        startingSeat = Number(seatStr)
        break
      }
    }

    const match: Match = {
      teams: {
        A: { seatNumbers: [1, 3], score: 0 },
        B: { seatNumbers: [2, 4], score: 0 },
      },
      roundNumber: 1,
      targetScore: 200,
      lastRoundWinnerSeat: null,
    }

    const hand: ServerHandState = {
      chain: [],
      openEnds: { left: -1, right: -1 },
      currentTurnSeat: startingSeat,
      status: 'in_progress',
      winnerSeat: null,
      playerTiles,
    }

    room.status = 'in_game'
    matchStore.set(code, match)
    handStore.set(code, hand)

    emitPlayerViews(io, room, match, hand, 'game_started')
  })
}
