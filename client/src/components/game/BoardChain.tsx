import type { PlacedTile } from '@double-six/shared'
import { DominoTile } from '../shared/DominoTile'

interface Props {
  chain: PlacedTile[]
}

export function BoardChain({ chain }: Props) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
    overflowX: 'auto',
    overflowY: 'visible',
    padding: '16px',
    minHeight: '120px',
    backgroundColor: '#166534',
    borderRadius: '10px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#4ade80 #14532d',
  }

  const emptyStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    color: '#4ade80',
    fontSize: '0.875rem',
    opacity: 0.7,
  }

  if (chain.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStyle}>Waiting for [6|6] to be played...</div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {chain.map((placedTile, index) => (
        <DominoTile
          key={index}
          tile={placedTile.tile}
          orientation={placedTile.orientation}
          isDouble={placedTile.isDouble}
        />
      ))}
    </div>
  )
}
