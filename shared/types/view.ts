import { Room } from './room'
import { Match } from './match'
import { Hand } from './hand'
import { Tile } from './tile'

export interface PlayerView{
    room: Room
    match: Match
    hand: Hand
    myTiles: Tile[]
    opponentTileCounts:{
        [seatNumber: number]: number
    }
}
