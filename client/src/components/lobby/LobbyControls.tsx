import type { Room } from '@double-six/shared'

interface Props {
  room: Room
  myPlayerId: string | null
  onStartGame: () => void
  startError: string | null
}

export function LobbyControls({ room, myPlayerId, onStartGame, startError }: Props) {
  const isHost = room.hostId === myPlayerId
  const allFilled = room.seats.every((s) => s.playerId !== null)

  if (!isHost) {
    return <p>Waiting for the host to start the game...</p>
  }

  return (
    <div>
      <button
        onClick={onStartGame}
        disabled={!allFilled}
        title={!allFilled ? 'All 4 seats must be filled before starting' : undefined}
      >
        Start Game
      </button>
      {!allFilled && <p>Waiting for all players to join...</p>}
      {startError && <p style={{ color: 'red' }}>{startError}</p>}
    </div>
  )
}
