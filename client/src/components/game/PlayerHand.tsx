import { useState } from 'react'
import type { Tile } from '@double-six/shared'
import { DominoTile } from '../shared/DominoTile'

interface Props {
  tiles: Tile[]
  isMyTurn: boolean
  openEnds: { left: number; right: number }
  onPlay: (tile: Tile, orientation: 'normal' | 'flipped') => void
}

function isValidTile(tile: Tile, openEnds: { left: number; right: number }): boolean {
  if (openEnds.left === -1) {
    return tile.left === 6 && tile.right === 6
  }
  return (
    tile.left === openEnds.left ||
    tile.right === openEnds.left ||
    tile.left === openEnds.right ||
    tile.right === openEnds.right
  )
}

function getOrientation(
  tile: Tile,
  openEnds: { left: number; right: number }
): 'normal' | 'flipped' {
  if (openEnds.left === -1) return 'normal'

  if (tile.left === openEnds.right) return 'normal'
  if (tile.right === openEnds.right) return 'flipped'
  if (tile.right === openEnds.left) return 'normal'
  if (tile.left === openEnds.left) return 'flipped'

  return 'normal'
}

export function PlayerHand({ tiles, isMyTurn, openEnds, onPlay }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  function handleTileClick(tile: Tile, index: number) {
    if (!isMyTurn) return
    if (!isValidTile(tile, openEnds)) return

    if (selectedIndex === index) {
      const orientation = getOrientation(tile, openEnds)
      onPlay(tile, orientation)
      setSelectedIndex(null)
    } else {
      setSelectedIndex(index)
    }
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    padding: '12px',
    backgroundColor: '#1e293b',
    borderRadius: '10px',
    minHeight: '80px',
  }

  return (
    <div style={containerStyle}>
      {tiles.map((tile, index) => {
        const valid = isMyTurn && isValidTile(tile, openEnds)
        const selected = selectedIndex === index
        return (
          <DominoTile
            key={`${tile.left}-${tile.right}-${index}`}
            tile={tile}
            isDouble={tile.left === tile.right}
            isSelected={selected}
            isValid={valid && !selected}
            onClick={() => handleTileClick(tile, index)}
          />
        )
      })}
    </div>
  )
}
