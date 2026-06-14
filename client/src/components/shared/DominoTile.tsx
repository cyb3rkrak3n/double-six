import type { Tile } from '@double-six/shared'

interface Props {
  tile: Tile
  orientation?: 'normal' | 'flipped'
  isDouble?: boolean
  isSelected?: boolean
  isValid?: boolean
  onClick?: () => void
  small?: boolean
}

const PIP_POSITIONS: Record<number, [number, number][]> = {
  0: [],
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
}

function PipGrid({ value, size }: { value: number; size: number }) {
  const positions = PIP_POSITIONS[value] ?? []
  const pipSize = size * 0.12

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {positions.map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: pipSize,
            height: pipSize,
            borderRadius: '50%',
            backgroundColor: '#1a1a1a',
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}

export function DominoTile({
  tile,
  orientation = 'normal',
  isDouble = false,
  isSelected = false,
  isValid = false,
  onClick,
  small = false,
}: Props) {
  const effectiveLeft = orientation === 'normal' ? tile.left : tile.right
  const effectiveRight = orientation === 'normal' ? tile.right : tile.left

  const halfSize = small ? 28 : 44
  const borderRadius = small ? 4 : 6
  const dividerThickness = 2

  const isHorizontal = !isDouble

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    alignItems: 'center',
    border: `2px solid ${isSelected ? '#2563eb' : isValid ? '#16a34a' : '#374151'}`,
    borderRadius,
    backgroundColor: '#f9fafb',
    cursor: onClick ? 'pointer' : 'default',
    boxShadow: isSelected ? '0 0 0 3px #93c5fd' : 'none',
    userSelect: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  const dividerStyle: React.CSSProperties = isHorizontal
    ? {
        width: dividerThickness,
        height: halfSize,
        backgroundColor: '#374151',
      }
    : {
        width: halfSize,
        height: dividerThickness,
        backgroundColor: '#374151',
      }

  return (
    <div style={containerStyle} onClick={onClick}>
      <PipGrid value={effectiveLeft} size={halfSize} />
      <div style={dividerStyle} />
      <PipGrid value={effectiveRight} size={halfSize} />
    </div>
  )
}
