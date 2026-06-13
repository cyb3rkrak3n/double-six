export interface Tile{
    left: number
    right: number
}

export interface PlacedTile{
    tile: Tile
    seatNumber: number
    orientation: 'normal' | 'flipped'
    isDouble: boolean
}