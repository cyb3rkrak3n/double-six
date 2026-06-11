# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────┐
│                   Client                     │
│                                             │
│  React + Vite                               │
│  SocketContext → hooks → components         │
│  localStorage (token)                       │
└─────────────────┬───────────────────────────┘
                  │ Socket.io (WebSocket)
┌─────────────────▼───────────────────────────┐
│                   Server                     │
│                                             │
│  Express + Socket.io                        │
│  socket/ → game/ → store/                  │
│  In-memory room store                       │
└─────────────────────────────────────────────┘
         ↑ shared/types (TypeScript) ↑
```

---

## 1. Player Action Flow

Every tile placement follows this exact path:

```
1. Player clicks a tile in their hand
2. PlayerHand component calls useGame.placeTile(tile, orientation)
3. useGame emits place_tile to the server via socket
4. server/socket/game.ts receives place_tile
5. rules.ts validates the move (correct turn, tile matches open end)
6. If invalid → emit move_error back to that client only, stop
7. If valid:
   a. Update hand state (add to chain, update openEnds)
   b. Check if placing player's hand is now empty → hand.status = 'finished'
   c. If not finished, scan all hands against openEnds
   d. If no valid moves exist for any player → hand.status = 'blocked'
   e. Advance currentTurnSeat clockwise
   f. Build a filtered PlayerView for each of the 4 clients
   g. Emit state_updated to each client with their own PlayerView
8. Each client receives state_updated
9. useGame updates local state
10. React re-renders the board, hands, and turn indicators
```

---

## 2. Room State Lifecycle

How `store/rooms.ts` evolves through a full match:

```
create_room
  → Room created in memory
  → status: 'lobby'
  → seats: all null
  → host assigned to seat 1

pick_seat / move_player
  → Seat slots populated with playerId and playerName
  → room_updated broadcast to all in room

start_game
  → Deck generated and shuffled (deck.ts)
  → 7 tiles dealt to each seat
  → Hand state initialized
  → status: 'in_game'
  → game_started emitted with filtered PlayerView per client

[round in progress]
  → Hand state mutates on every place_tile and pass_turn
  → state_updated emitted after every mutation

hand.status = 'finished' or 'blocked'
  → Scoring calculated (rules.ts)
  → Match scores updated
  → round_ended emitted to all
  → If either team >= 200 → match_ended emitted, room destroyed
  → Otherwise → new hand initialized, round_started emitted

match_ended
  → Room removed from in-memory store
```

---

## 3. Identity & Reconnection Flow

```
First visit:
  client connects
  → emits register_player { playerName } (no token)
  → server generates playerId (UUID) and token (UUID)
  → stores token → playerId mapping in store/rooms.ts
  → emits player_registered { playerId, token, playerName }
  → client stores token in localStorage

Returning visit / reconnection:
  client connects
  → reads token from localStorage
  → emits register_player { token, playerName }
  → server looks up token → finds existing playerId
  → restores identity
  → emits player_registered with same playerId

Mid-game reconnection:
  → server finds the room where that playerId has a seat
  → sets seat.connected = true
  → sets seat.autoPlay = false (if it was set)
  → emits player_reconnected to all in room
  → emits state_updated with full PlayerView to returning client
  → if rejoining mid-hand, waits until next hand to restore control
```

---

## 4. Auto-Play Flow

```
player disconnects mid-game
  → seat.connected = false
  → game pauses, status: 'paused'
  → player_disconnected emitted to all

host chooses 'continue'
  → seat.autoPlay = true
  → status: 'in_game'

when currentTurnSeat === disconnected seat:
  → server waits 1500ms (simulated delay)
  → autoplay.ts picks first valid tile in hand
  → places tile as if the player played it
  → emits auto_play { seatNumber, tile, orientation } to all
  → client renders the tile placement visually
  → after animation settles, emits state_updated to all

player reconnects while autoPlay = true:
  → if mid-hand: seat.autoPlay stays true until hand ends
  → on next hand start: seat.autoPlay = false, player resumes control
```

---

## 5. Host Reassignment Flow

```
host disconnects
  → server checks joinOrder[]
  → next connected player in joinOrder becomes host
  → room.hostId updated
  → host_changed emitted to all with newHostId and playerName
  → new host now sees host controls in the UI
```