import { Room, Match, Hand, PlayerView, Tile } from '@double-six/shared'
import { socketIds } from '../store/rooms'

interface ServerHandState extends Hand {
  playerTiles: Record<number, Tile[]>
}

export function buildPlayerView(
  room: Room,
  match: Match,
  hand: ServerHandState,
  forSeatNumber: number
): PlayerView {
  const myTiles = hand.playerTiles[forSeatNumber] ?? []

  const opponentTileCounts: Record<number, number> = {}
  for (const [seatStr, tiles] of Object.entries(hand.playerTiles)) {
    const seat = Number(seatStr)
    if (seat !== forSeatNumber) {
      opponentTileCounts[seat] = tiles.length
    }
  }

  return {
    room,
    match,
    hand: {
      chain: hand.chain,
      openEnds: hand.openEnds,
      currentTurnSeat: hand.currentTurnSeat,
      status: hand.status,
      winnerSeat: hand.winnerSeat,
    },
    myTiles,
    opponentTileCounts,
  }
}

export function emitPlayerViews(
  io: any,
  room: Room,
  match: Match,
  hand: ServerHandState,
  event: string
) {
  for (const seat of room.seats) {
    if (!seat.playerId || !seat.connected) continue
    const socketId = socketIds.get(seat.playerId)
    if (!socketId) continue
    const view = buildPlayerView(room, match, hand, seat.seatNumber)
    io.to(socketId).emit(event, { playerView: view })
  }
}

export type { ServerHandState }
