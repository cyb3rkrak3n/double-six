import { Room } from './room'
import { PlayerView } from './view'
import { Tile } from './tile'

// Identity
export interface RegisterPlayerPayload{
    token?: string
    playerName: string
}

export interface PlayerRegisteredPayload{
    playerId: string
    token: string
    playerName: string
}

// Room & Lobby
export interface RoomCreatedPayload{
    code: string
    seatNumber: number
}

export interface JoinRoomPayload{
    code: string
}

export interface RoomJoinedPayload{
    room: Room
}

export interface RoomUpdatedPayload{
    room: Room
}

export interface JoinErrorPayload{
    message: string
}

export interface PickSeatPayload{
    seatNumber: number
}

export interface MovePlayerPayload{
    playerId: string
    seatNumber:number
}

export interface StartErrorPayload{
    message: string
}

// In-Game
export interface GameStartedPayload{
    playerView: PlayerView
}

export interface PlaceTilePayload{
    tile: Tile
    orientation: 'normal' | 'flipped'
}

export interface MoveErrorPayload{
    message: string
}

export interface StateUpdatedPayload{
    playerView: PlayerView
}

// Round & Match
export interface RoundEndedPayload{
    winnerSeat: number | null
    scoreDelta: number
    match: PlayerView['match']
}

export interface RoundStartedPayload{
    playerView: PlayerView
}

export interface MatchEndedPayload{
    winningTeam: 'A' | 'B'
    match: PlayerView['match']
}

// Disconnect
export interface PlayerDisconnectedPayload{
    seatNumber: number
    playerName: string
}

export type HostDecision = 'wait' | 'continue' | 'end'

export interface HostDecisionPayload{
    decision: HostDecision
}

export interface PlayerReconnectedPayload{
    seatNumber: number
    playerName: string
}

export interface AutoPlayPayload{
    seatNumber: number
    tile: Tile
    orientation: 'normal' | 'flipped'
}

export interface GameEndedPayload{
    reason: 'host_ended'
}

// Host Reassignment
export interface HostChangedPayload{
    newHostId: string
    playerName: string
}
