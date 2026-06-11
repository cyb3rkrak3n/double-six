# Double Six

4-player partnership dominoes game

## Overview

Double Six is a real-time multiplayer dominoes game for exactly 4 players split into 2 teams (seats 1 & 3 vs seats 2 & 4). All 28 tiles are dealt with no boneyard. The first team to reach 200 points wins the match.

Game logic is fully server-authoritative. Each client receives a filtered view of the game state — opponents' tile counts only, never their actual tiles.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Backend | Node.js, Express, Socket.io |
| Shared types | TypeScript (npm workspace package) |
| Monorepo | npm workspaces |

## Getting Started

> Prerequisites: Node.js 18+, npm 9+

```bash
# Install all dependencies from the root
npm install

# Run in separate terminals
cd server && npm run dev   # Terminal 1
cd client && npm run dev   # Terminal 2
```

## Project Structure

```
double-six/
├── client/        # React + Vite frontend
├── server/        # Node.js + Socket.io backend
└── shared/        # Shared TypeScript types (single source of truth)
```

See [AGENTS.md](AGENTS.md) for architecture constraints and conventions, and [docs/](docs/) for full design docs.
