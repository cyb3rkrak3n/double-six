import { Server, Socket } from 'socket.io'
import { Tile } from '@double-six/shared'
import { rooms } from '../store/rooms'
import { matchStore, handStore } from './lobby'
import { emitPlayerViews } from '../game/state'
import {
  isValidPlacement,
  hasValidMove,
  anyPlayerHasValidMove,
  applyPlacement,
  calculateScore,
  nextSeatClockwise,
} from '../game/rules'
import { generateDeck, dealTiles } from '../game/deck'

export function registerGameHandlers(io: Server, socket: Socket) {
  socket.on('place_tile', (payload: { tile: Tile; orientation: 'normal' | 'flipped' }) => {
    const code = socket.data.roomCode as string
    const playerId = socket.data.playerId as string
    const room = rooms.get(code)
    const match = matchStore.get(code)
    const hand = handStore.get(code)

    if (!room || !match || !hand) return
    if (room.status !== 'in_game') return

    const seat = room.seats.find((s) => s.playerId === playerId)
    if (!seat) return

    if (seat.seatNumber !== hand.currentTurnSeat) {
      socket.emit('move_error', { message: 'It is not your turn' })
      return
    }

    if (!isValidPlacement(payload.tile, payload.orientation, hand)) {
      socket.emit('move_error', { message: 'Invalid tile placement' })
      return
    }

    applyPlacement(payload.tile, payload.orientation, seat.seatNumber, hand)

    if (hand.playerTiles[seat.seatNumber].length === 0) {
      hand.status = 'finished'
      hand.winnerSeat = seat.seatNumber

      const { winningTeam, scoreDelta } = calculateScore(hand)

      if (scoreDelta > 0) {
        match.teams[winningTeam].score += scoreDelta
      }

      match.lastRoundWinnerSeat = seat.seatNumber

      io.to(code).emit('round_ended', {
        winnerSeat: seat.seatNumber,
        scoreDelta,
        match,
      })

      if (match.teams[winningTeam].score >= match.targetScore) {
        room.status = 'finished'
        io.to(code).emit('match_ended', { winningTeam, match })
        return
      }

      startNextRound(io, code, room, match)
      return
    }

    if (!anyPlayerHasValidMove(hand)) {
      hand.status = 'blocked'

      const { winningTeam, scoreDelta } = calculateScore(hand)

      if (scoreDelta > 0) {
        match.teams[winningTeam].score += scoreDelta
      }

      match.lastRoundWinnerSeat =
        scoreDelta === 0 ? match.lastRoundWinnerSeat : hand.winnerSeat

      io.to(code).emit('round_ended', {
        winnerSeat: null,
        scoreDelta,
        match,
      })

      if (match.teams[winningTeam].score >= match.targetScore) {
        room.status = 'finished'
        io.to(code).emit('match_ended', { winningTeam, match })
        return
      }

      startNextRound(io, code, room, match)
      return
    }

    hand.currentTurnSeat = nextSeatClockwise(hand.currentTurnSeat)

    emitPlayerViews(io, room, match, hand, 'state_updated')
  })

  socket.on('pass_turn', () => {
    const code = socket.data.roomCode as string
    const playerId = socket.data.playerId as string
    const room = rooms.get(code)
    const match = matchStore.get(code)
    const hand = handStore.get(code)

    if (!room || !match || !hand) return
    if (room.status !== 'in_game') return

    const seat = room.seats.find((s) => s.playerId === playerId)
    if (!seat) return

    if (seat.seatNumber !== hand.currentTurnSeat) {
      socket.emit('move_error', { message: 'It is not your turn' })
      return
    }

    const playerTiles = hand.playerTiles[seat.seatNumber]
    if (hasValidMove(playerTiles, hand)) {
      socket.emit('move_error', { message: 'You must play a tile if you have a valid move' })
      return
    }

    hand.currentTurnSeat = nextSeatClockwise(hand.currentTurnSeat)

    emitPlayerViews(io, room, match, hand, 'state_updated')
  })
}

function startNextRound(
  io: Server,
  code: string,
  room: ReturnType<typeof rooms.get>,
  match: ReturnType<typeof matchStore.get>
) {
  if (!room || !match) return

  const deck = generateDeck()
  const [hand1, hand2, hand3, hand4] = dealTiles(deck)

  const playerTiles: Record<number, Tile[]> = {
    1: hand1,
    2: hand2,
    3: hand3,
    4: hand4,
  }

  const startingSeat = match.lastRoundWinnerSeat ?? 1

  const newHand = {
    chain: [],
    openEnds: { left: -1, right: -1 },
    currentTurnSeat: startingSeat,
    status: 'in_progress' as const,
    winnerSeat: null,
    playerTiles,
  }

  handStore.set(code, newHand)
  match.roundNumber += 1

  emitPlayerViews(io, room, match, newHand, 'round_started')
}
