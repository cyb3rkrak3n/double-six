import { Room, Player } from '@double-six/shared'

// token -> Player
export const players = new Map<string, Player>()

// room code -> Room
export const rooms = new Map<string, Room>()

// playerId -> socketId
export const socketIds = new Map<string, string>()

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars
  let code: string
  do {
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  } while (rooms.has(code))
  return code
}

export function createEmptySeats(): Room['seats'] {
  return [1, 2, 3, 4].map((n) => ({
    seatNumber: n as 1 | 2 | 3 | 4,
    playerId: null,
    playerName: null,
    connected: false,
    autoPlay: false,
  })) as unknown as Room['seats']
}
