# Project Structure

## Root

```
double-six/
├── client/                    // React + Vite frontend
├── server/                    // Node.js + Express + Socket.io backend
├── shared/                    // shared TypeScript types used by both
├── docs/                      // architecture and design documents
│   ├── rules.md
│   ├── room-lifecycle.md
│   ├── game-state-shape.md
│   ├── socket-event-map.md
│   ├── component-tree.md
│   └── project-structure.md
├── AGENTS.md                  // context file for AI coding agents
└── package.json               // root package.json for workspace management
```

---

## Shared

```
shared/
└── types/
    ├── tile.ts                // Tile, PlacedTile
    ├── room.ts                // Room, Seat, RoomStatus
    ├── match.ts               // Match
    ├── hand.ts                // Hand
    ├── player.ts              // Player
    ├── view.ts                // PlayerView
    └── events.ts              // all socket event payloads as types
```

---

## Server

```
server/
├── src/
│   ├── index.ts               // entry point, Express + Socket.io setup
│   ├── socket/
│   │   ├── index.ts           // registers all socket event handlers
│   │   ├── room.ts            // create_room, join_room, pick_seat, move_player
│   │   ├── lobby.ts           // start_game, start_error
│   │   ├── game.ts            // place_tile, pass_turn, move_error, state_updated
│   │   └── disconnection.ts   // player_disconnected, host_decision, reconnection
│   ├── game/
│   │   ├── deck.ts            // tile generation and dealing
│   │   ├── rules.ts           // valid move checking, blocked detection, scoring
│   │   ├── autoplay.ts        // auto-play logic for missing players
│   │   └── state.ts           // PlayerView builder, state filtering per player
│   └── store/
│       └── rooms.ts           // in-memory room store, token registry
├── package.json
└── tsconfig.json
```

---

## Client

```
client/
├── src/
│   ├── main.tsx               // entry point
│   ├── App.tsx                // router setup
│   ├── context/
│   │   └── SocketContext.tsx  // SocketProvider, exposes socket, playerId, token
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LobbyPage.tsx
│   │   └── GamePage.tsx
│   ├── components/
│   │   ├── home/
│   │   │   ├── NameForm.tsx
│   │   │   ├── CreateRoomButton.tsx
│   │   │   └── JoinRoomForm.tsx
│   │   ├── lobby/
│   │   │   ├── RoomCodeDisplay.tsx
│   │   │   ├── SeatingArea.tsx
│   │   │   ├── SeatSlot.tsx
│   │   │   ├── SeatControls.tsx
│   │   │   └── LobbyControls.tsx
│   │   ├── game/
│   │   │   ├── ScoreBoard.tsx
│   │   │   ├── GameTable.tsx
│   │   │   ├── BoardChain.tsx
│   │   │   ├── OpponentArea.tsx
│   │   │   ├── SidePlayer.tsx
│   │   │   ├── LocalPlayerArea.tsx
│   │   │   ├── PlayerHand.tsx
│   │   │   ├── PlayerControls.tsx
│   │   │   ├── DisconnectionModal.tsx
│   │   │   ├── HostDecisionControls.tsx
│   │   │   ├── RoundEndModal.tsx
│   │   │   └── RoundSummary.tsx
│   │   └── shared/
│   │       ├── DominoTile.tsx
│   │       ├── PlayerTag.tsx
│   │       └── TurnIndicator.tsx
│   ├── hooks/
│   │   ├── useSocket.ts       // consumes SocketContext
│   │   ├── useRoom.ts         // room state and seat events
│   │   ├── useGame.ts         // game state, place tile, pass turn
│   │   └── useAutoPlay.ts     // handles auto_play event and delay
│   └── types/                 // re-exports from shared/types
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Notes

- `shared/` is the key piece — both client and server import from it, so types never drift out of sync
- `store/rooms.ts` is the entire database for MVP — a plain in-memory Map of room code to room state
- `hooks/` keeps socket logic out of components — pages and components just call hooks, never touch the socket directly
- `game/rules.ts` is the most critical server file — valid move enforcement, blocked detection, and scoring all live here