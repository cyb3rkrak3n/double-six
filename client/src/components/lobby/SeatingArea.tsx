import { Room } from '@double-six/shared'
import { SeatSlot } from './SeatSlot'

interface Props {
  room: Room
  myPlayerId: string | null
  onSit: (seatNumber: number) => void
  onMove: (playerId: string, seatNumber: number) => void
}

export function SeatingArea({ room, myPlayerId, onSit, onMove }: Props) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {room.seats.map((seat) => (
        <SeatSlot
          key={seat.seatNumber}
          seat={seat}
          isHost={room.hostId === myPlayerId}
          myPlayerId={myPlayerId}
          onSit={() => onSit(seat.seatNumber)}
          onMove={onMove}
        />
      ))}
    </div>
  )
}
