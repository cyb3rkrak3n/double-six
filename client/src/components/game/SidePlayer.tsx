import type { Seat } from '@double-six/shared'
import { PlayerTag } from '../shared/PlayerTag'

interface Props {
  seat: Seat
  tileCount: number
  isCurrentTurn: boolean
  isHost: boolean
  side: 'left' | 'right'
}

export function SidePlayer({ seat, tileCount, isCurrentTurn, isHost, side }: Props) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
  }

  const tilesColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
  }

  const faceDownTileStyle: React.CSSProperties = {
    width: 28,
    height: 52,
    borderRadius: 4,
    backgroundColor: '#1d4ed8',
    border: '2px solid #1e40af',
    backgroundImage: 'repeating-linear-gradient(45deg, #1e40af 0px, #1e40af 2px, transparent 2px, transparent 8px)',
    transform: side === 'left' ? 'rotate(90deg)' : 'rotate(-90deg)',
  }

  const tileCountStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginTop: '2px',
  }

  return (
    <div style={containerStyle}>
      <PlayerTag
        playerName={seat.playerName ?? '?'}
        isHost={isHost}
        isConnected={seat.connected}
        isCurrentTurn={isCurrentTurn}
      />
      <div style={tilesColumnStyle}>
        {Array.from({ length: tileCount }).map((_, i) => (
          <div key={i} style={faceDownTileStyle} />
        ))}
      </div>
      <div style={tileCountStyle}>
        {tileCount} tile{tileCount !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
