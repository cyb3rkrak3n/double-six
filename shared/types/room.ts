export type RoomStatus = 'lobby' | 'in_game' | 'paused' | 'finished'

export interface Seat{
    seatNumber: 1 | 2 | 3 | 4
    playerId: string | null
    playerName: string | null
    connected: boolean
    autoPlay: Boolean
}

export interface Room{
    code: string
    hostId: string
    status: RoomStatus
    joinOrder: string[]
    seats: [Seat, Seat, Seat, Seat]
}