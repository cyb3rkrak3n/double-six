# AGENTS.md

## Project Overview

4-player partnership dominoes game (Double Six). TypeScript monorepo with a shared types layer.

- `client/` — React + Vite frontend
- `server/` — Node.js + Express + Socket.io backend
- `shared/` — shared TypeScript types imported by both client and server, single source of truth

Full rules, architecture decisions, and design docs are in `docs/`.

---

## Dev Setup

Install dependencies from the root:

```bash
npm install
```

Run server and client in separate terminals:

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

---

## Conventions

- Socket events use `snake_case` (e.g. `place_tile`, `game_started`)
- All game logic lives server-side only — never in the client
- Types are defined in `shared/types/` and never duplicated in client or server
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Small logical commits — one concern per commit

---

## Key Files

| File | Purpose |
|---|---|
| `shared/types/events.ts` | All socket event payload types |
| `shared/types/view.ts` | PlayerView — what each client receives |
| `server/src/game/rules.ts` | Valid move enforcement, blocked detection, scoring |
| `server/src/game/state.ts` | PlayerView builder, filters state per player |
| `server/src/game/deck.ts` | Tile generation and dealing |
| `server/src/store/rooms.ts` | In-memory room store and token registry |
| `server/src/socket/index.ts` | Registers all socket event handlers |

---

## Game Rules Summary

- 4 players, 2 teams (seats 1 & 3 vs seats 2 & 4)
- All 28 tiles dealt, no boneyard
- Player with [6|6] starts the first round
- Valid move: tile must match an open end of the chain
- A player cannot pass if they have a valid move — enforced server-side
- Blocked game: detected immediately after any tile placement by scanning all hands against open ends
- Winning team scores the total pip count of both opponents' remaining tiles
- First team to 200 points wins the match

See `docs/rules.md` for the full ruleset.

---

## Architecture Constraints

- Game state is server-side authoritative — the client never decides if a move is valid
- Each client receives a filtered `PlayerView` — opponents' tile counts only, never their actual tiles
- Player identity uses a server-generated UUID (`playerId`) and a persistent client token stored in `localStorage`
- Room state lives in memory only — no database in MVP
- If the host disconnects, the next player in join order is promoted to host automatically

See `docs/` for full architecture docs.