import type { Tile } from '@double-six/shared'
import { PlayerHand } from './PlayerHand'
import { PlayerControls } from './PlayerControls'
import { PlayerTag } from '../shared/PlayerTag'

interface Props {
  playerName: string
  isHost: boolean
  isMyTurn: boolean
  tiles: Tile[]
  openEnds: { left: number; right: number }
  currentPlayerName: string
  canPass: boolean
  moveError: string | null
  onPlay: (tile: Tile, orientation: 'normal' | 'flipped') => void
  onPass: () => void
}

export function LocalPlayerArea({
  playerName,
  isHost,
  isMyTurn,
  tiles,
  openEnds,
  currentPlayerName,
  canPass,
  moveError,
  onPlay,
  onPass,
}: Props) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 4px',
  }

  const tileCountStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#94a3b8',
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <PlayerTag
          playerName={playerName}
          isHost={isHost}
          isCurrentTurn={isMyTurn}
        />
        <div style={tileCountStyle}>{tiles.length} tile{tiles.length !== 1 ? 's' : ''}</div>
      </div>
      <PlayerHand
        tiles={tiles}
        isMyTurn={isMyTurn}
        openEnds={openEnds}
        onPlay={onPlay}
      />
      <PlayerControls
        isMyTurn={isMyTurn}
        currentPlayerName={currentPlayerName}
        canPass={canPass}
        moveError={moveError}
        onPass={onPass}
      />
    </div>
  )
}
