import { Tile } from '@double-six/shared'

export function generateDeck(): Tile[] {
  const tiles: Tile[] = []
  for (let left = 0; left <= 6; left++) {
    for (let right = left; right <= 6; right++) {
      tiles.push({ left, right })
    }
  }
  return tiles
}

export function shuffleDeck(tiles: Tile[]): Tile[] {
  const deck = [...tiles]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export function dealTiles(deck: Tile[]): [Tile[], Tile[], Tile[], Tile[]] {
  const shuffled = shuffleDeck(deck)
  return [
    shuffled.slice(0, 7),
    shuffled.slice(7, 14),
    shuffled.slice(14, 21),
    shuffled.slice(21, 28),
  ]
}
