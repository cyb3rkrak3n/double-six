import { PlacedTile, Tile } from './tile'

export type HandStatus = 'in_progress' | 'blocked' | 'finished'

export interface Hand{
    chain: PlacedTile[]
    openEnds: {
        left: number
        right: number
    }
    currentTurnSeat: number
    status: HandStatus
    winnerSeat: number | null
}