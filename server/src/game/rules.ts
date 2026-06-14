import { Tile, PlacedTile } from '@double-six/shared'
import { ServerHandState } from './state'

export function isValidPlacement(
  tile: Tile,
  orientation: 'normal' | 'flipped',
  hand: ServerHandState
): boolean {
  if (hand.chain.length === 0) {
    return tile.left === 6 && tile.right === 6
  }

  const placedLeft = orientation === 'normal' ? tile.left : tile.right
  const placedRight = orientation === 'normal' ? tile.right : tile.left

  return placedLeft === hand.openEnds.left || placedRight === hand.openEnds.right
}

export function getValidTiles(
  tiles: Tile[],
  hand: ServerHandState
): Tile[] {
  if (hand.chain.length === 0) {
    return tiles.filter((t) => t.left === 6 && t.right === 6)
  }

  return tiles.filter((t) =>
    t.left === hand.openEnds.left ||
    t.right === hand.openEnds.left ||
    t.left === hand.openEnds.right ||
    t.right === hand.openEnds.right
  )
}

export function hasValidMove(tiles: Tile[], hand: ServerHandState): boolean {
  return getValidTiles(tiles, hand).length > 0
}

export function anyPlayerHasValidMove(hand: ServerHandState): boolean {
  return Object.values(hand.playerTiles).some((tiles) =>
    hasValidMove(tiles, hand)
  )
}

export function applyPlacement(
  tile: Tile,
  orientation: 'normal' | 'flipped',
  seatNumber: number,
  hand: ServerHandState
): void {
  const isDouble = tile.left === tile.right
  const placedTile: PlacedTile = { tile, seatNumber, orientation, isDouble }

  const effectiveLeft = orientation === 'normal' ? tile.left : tile.right
  const effectiveRight = orientation === 'normal' ? tile.right : tile.left

  if (hand.chain.length === 0) {
    hand.chain.push(placedTile)
    hand.openEnds.left = effectiveLeft
    hand.openEnds.right = effectiveRight
  } else if (effectiveLeft === hand.openEnds.right) {
    hand.chain.push(placedTile)
    hand.openEnds.right = effectiveRight
  } else if (effectiveRight === hand.openEnds.left) {
    hand.chain.unshift(placedTile)
    hand.openEnds.left = effectiveLeft
  }

  const playerHand = hand.playerTiles[seatNumber]
  const tileIndex = playerHand.findIndex(
    (t) => t.left === tile.left && t.right === tile.right
  )
  if (tileIndex !== -1) playerHand.splice(tileIndex, 1)
}

export function calculateScore(hand: ServerHandState): {
  winningTeam: 'A' | 'B'
  scoreDelta: number
} {
  const teamA = [1, 3]
  const teamB = [2, 4]

  const teamAPips = teamA.reduce((sum, seat) => {
    return sum + hand.playerTiles[seat].reduce((s, t) => s + t.left + t.right, 0)
  }, 0)

  const teamBPips = teamB.reduce((sum, seat) => {
    return sum + hand.playerTiles[seat].reduce((s, t) => s + t.left + t.right, 0)
  }, 0)

  if (hand.status === 'finished') {
    const winningTeam = teamA.includes(hand.winnerSeat!) ? 'A' : 'B'
    const losingPips = winningTeam === 'A' ? teamBPips : teamAPips
    return { winningTeam, scoreDelta: losingPips }
  } else {
    if (teamAPips < teamBPips) {
      return { winningTeam: 'A', scoreDelta: teamBPips - teamAPips }
    } else if (teamBPips < teamAPips) {
      return { winningTeam: 'B', scoreDelta: teamAPips - teamBPips }
    } else {
      return { winningTeam: 'A', scoreDelta: 0 }
    }
  }
}

export function nextSeatClockwise(currentSeat: number): number {
  return (currentSeat % 4) + 1
}
