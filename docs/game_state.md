# Game State Shape

## Player

```typescript
interface Player {
  playerId: string       // server-generated UUID, stable across reconnections
  token: string          // persistent client token stored in localStorage
  playerName: string     // user-chosen display name
}
```

---

## Tile

```typescript
interface Tile {
  left: number
  right: number
}
```

---

## Placed Tile

```typescript
interface PlacedTile {
  tile: Tile
  seatNumber: number         // who played it
  orientation: 'normal' | 'flipped'  // which side connected to the chain
  isDouble: boolean
}
```

---

## Room State

```typescript
type RoomStatus = 'lobby' | 'in_game' | 'paused' | 'finished'

interface Room {
  code: string
  hostId: string
  status: RoomStatus
  joinOrder: string[]        // player IDs in order they joined, used for host reassignment
  seats: [Seat, Seat, Seat, Seat]
}

interface Seat {
  seatNumber: 1 | 2 | 3 | 4
  playerId: string | null
  playerName: string | null
  connected: boolean
  autoPlay: boolean          // true when host chose "continue without player"
}
```

---

## Match State

```typescript
interface Match {
  teams: {
    A: { seatNumbers: [1, 3], score: number }
    B: { seatNumbers: [2, 4], score: number }
  }
  roundNumber: number
  targetScore: number        // 200
  lastRoundWinnerSeat: number | null
}
```

---

## Hand State

```typescript
interface Hand {
  chain: PlacedTile[]        // full ordered sequence of placed tiles
  openEnds: {
    left: number             // pip value of the left open end
    right: number            // pip value of the right open end
  }
  currentTurnSeat: number
  status: 'in_progress' | 'blocked' | 'finished'
  winnerSeat: number | null
}
```

---

## Per-Player View

What each client receives — other players' tiles are never sent, only their count.

```typescript
interface PlayerView {
  room: Room
  match: Match
  hand: Hand
  myTiles: Tile[]
  opponentTileCounts: {
    [seatNumber: number]: number
  }
}
```

---

## Server Logic

### After every tile placement

```
update openEnds
scan all 4 players' hands against openEnds
if no player has a matching tile → hand.status = 'blocked'
if placing player's hand is empty → hand.status = 'finished', winnerSeat = seatNumber
```

### After every pass

```
advance currentTurnSeat to the next seat clockwise
```

### Blocked game detection rule

A player cannot pass if they have a tile matching either open end — enforced server-side.
Blocked state is detected immediately after any tile placement, not by counting passes.