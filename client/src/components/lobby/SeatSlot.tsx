import type { Seat } from '@double-six/shared'

interface Props {
  seat: Seat
  isHost: boolean
  myPlayerId: string | null
  onSit: () => void
  onMove: (playerId: string, seatNumber: number) => void
}

export function SeatSlot({ seat, isHost, myPlayerId, onSit, onMove }: Props) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', minWidth: '120px' }}>
      <div>Seat {seat.seatNumber}</div>
      {seat.playerId ? (
        <div>
          {seat.playerName} {seat.connected ? '' : '(disconnected)'}
        </div>
      ) : (
        <button onClick={onSit}>Sit here</button>
      )}
      {isHost && seat.playerId && seat.playerId !== myPlayerId && (
        <div>
          <small>Host controls: move to seat...</small>
        </div>
      )}
    </div>
  )
}
