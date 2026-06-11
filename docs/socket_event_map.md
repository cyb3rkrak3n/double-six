# Socket Event Map

All events use `snake_case`. Direction is from the perspective of the client.

---

## Identity Model

```typescript
interface Player {
  playerId: string       // server-generated UUID, stable across reconnections
  token: string          // persistent client token stored in localStorage
  playerName: string     // user-chosen display name
}
```

### Registration Flow

```
client connects
  → sends token from localStorage (or nothing if first time)
server receives register_player
  → if token matches known player: restore playerId and playerName
  → if no token or unknown token: generate new playerId and token
  → emit player_registered back to client
client receives player_registered
  → persist token to localStorage
  → proceed to create or join a room
```

---

## Room & Lobby

| Event | Direction | Payload | Description |
|---|---|---|---|
| `register_player` | client → server | `{ token?, playerName }` | On connect, client sends existing token or none for first time |
| `player_registered` | server → client | `{ playerId, token, playerName }` | Server assigns or restores identity, returns token to persist |
| `create_room` | client → server | `{}` | Create a new room |
| `room_created` | server → client | `{ code, seatNumber }` | Confirms creation, host assigned to seat 1 |
| `join_room` | client → server | `{ code }` | Join an existing room |
| `room_joined` | server → client | `{ room }` | Confirms join, sends current room state |
| `room_updated` | server → all | `{ room }` | Broadcast whenever seats change |
| `join_error` | server → client | `{ message }` | Room not found, full, or game already started |
| `pick_seat` | client → server | `{ seatNumber }` | Player picks an available seat |
| `move_player` | client → server | `{ playerId, seatNumber }` | Host moves a player to a different seat |
| `start_game` | client → server | `{}` | Host starts the game |
| `start_error` | server → client | `{ message }` | Not enough players or seats not filled |

---

## In-Game

| Event | Direction | Payload | Description |
|---|---|---|---|
| `game_started` | server → all | `{ playerView }` | Game begins, each player gets their own filtered view |
| `place_tile` | client → server | `{ tile, orientation }` | Player places a tile |
| `pass_turn` | client → server | `{}` | Player passes (no valid move) |
| `move_error` | server → client | `{ message }` | Invalid move or not your turn |
| `state_updated` | server → all | `{ playerView }` | Broadcast after every valid move, filtered per player |

---

## Round & Match

| Event | Direction | Payload | Description |
|---|---|---|---|
| `round_ended` | server → all | `{ winnerSeat, scoreDelta, match }` | Round is over, scores updated |
| `round_started` | server → all | `{ playerView }` | New round begins |
| `match_ended` | server → all | `{ winningTeam, match }` | A team hit 200 |

---

## Disconnection

| Event | Direction | Payload | Description |
|---|---|---|---|
| `player_disconnected` | server → all | `{ seatNumber, playerName }` | A player dropped, game paused |
| `host_decision` | client → server | `{ decision: 'wait' \| 'continue' \| 'end' }` | Host chooses how to handle disconnection |
| `player_reconnected` | server → all | `{ seatNumber, playerName }` | Dropped player rejoined |
| `auto_play` | server → all | `{ seatNumber, tile, orientation }` | Server played on behalf of missing player |
| `game_ended` | server → all | `{ reason: 'host_ended' }` | Host chose to end the game |

---

## Host Reassignment

| Event | Direction | Payload | Description |
|---|---|---|---|
| `host_changed` | server → all | `{ newHostId, playerName }` | Host disconnected, next player in join order promoted |