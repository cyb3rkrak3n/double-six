# Component Tree

## Routes

```
/                   → HomePage
/lobby/:code        → LobbyPage
/game/:code         → GamePage
```

---

## App Shell

```
App
├── Router
│   ├── Route /                → HomePage
│   ├── Route /lobby/:code     → LobbyPage
│   └── Route /game/:code      → GamePage
└── SocketProvider             // manages socket connection and player identity globally
```

---

## HomePage (`/`)

```
HomePage
├── NameForm                   // input for playerName, submits register_player
└── RoomActions                // shown after registration
    ├── CreateRoomButton
    └── JoinRoomForm           // input for room code, submits join_room
```

---

## LobbyPage (`/lobby/:code`)

```
LobbyPage
├── RoomCodeDisplay            // shows the code, copy to clipboard button
├── SeatingArea
│   ├── SeatSlot (x4)         // each seat: empty or occupied, pick/swap controls
│   │   ├── PlayerTag          // shows playerName, host crown if host
│   │   └── SeatControls       // "Sit here" if empty, host move controls if occupied
└── LobbyControls
    ├── StartGameButton        // host only, disabled until all 4 seats filled
    └── WaitingMessage         // non-host view
```

---

## GamePage (`/game/:code`)

```
GamePage
├── ScoreBoard                 // both teams, current scores, round number
├── GameTable                  // the main play area
│   ├── OpponentArea (top)     // seat across — tile count, name, turn indicator
│   ├── SidePlayer (left)      // seat to the left — tile count, name, turn indicator
│   ├── SidePlayer (right)     // seat to the right — tile count, name, turn indicator
│   ├── BoardChain             // the domino chain, scrollable if it grows long
│   │   └── DominoTile (xN)   // each placed tile, orientation aware
│   └── LocalPlayerArea (bottom)
│       ├── PlayerHand
│       │   └── DominoTile (x7) // selectable, highlights valid moves
│       └── PlayerControls
│           ├── PassButton      // disabled if valid move exists
│           └── TurnIndicator   // "Your turn" / "Waiting for X"
├── DisconnectionModal          // shown when a player drops
│   └── HostDecisionControls    // wait / continue / end — host only
└── RoundEndModal               // shown at end of each round
    ├── RoundSummary            // who won, pip counts, score delta
    └── NextRoundButton         // host only
```

---

## Shared Components

```
DominoTile                     // used in hand and on board, accepts orientation + isDouble
PlayerTag                      // name + optional crown for host
TurnIndicator                  // reused in sidebar players and local player area
```

---

## Notes

- `SocketProvider` wraps the whole app — manages the socket connection, stores `playerId` and `token`, and exposes them via context so any component can access them without prop drilling
- `DominoTile` is the most reused component — it renders differently depending on whether it's in the hand (selectable), on the board (placed, orientation-aware), or in an opponent slot (face count only)
- `DisconnectionModal` is always mounted during a game but only visible when `room.status === 'paused'`