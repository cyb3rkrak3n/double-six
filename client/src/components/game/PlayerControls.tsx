import { TurnIndicator } from '../shared/TurnIndicator'

interface Props {
  isMyTurn: boolean
  currentPlayerName: string
  canPass: boolean
  moveError: string | null
  onPass: () => void
}

export function PlayerControls({
  isMyTurn,
  currentPlayerName,
  canPass,
  moveError,
  onPass,
}: Props) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    backgroundColor: '#0f172a',
    borderRadius: '10px',
    gap: '12px',
  }

  const passButtonStyle: React.CSSProperties = {
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: canPass && isMyTurn ? '#dc2626' : '#374151',
    color: canPass && isMyTurn ? '#ffffff' : '#6b7280',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: canPass && isMyTurn ? 'pointer' : 'not-allowed',
    transition: 'background-color 0.15s',
  }

  const errorStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: '#f87171',
    fontWeight: 500,
  }

  return (
    <div style={containerStyle}>
      <TurnIndicator
        isMyTurn={isMyTurn}
        currentPlayerName={currentPlayerName}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        {moveError && <div style={errorStyle}>{moveError}</div>}
        <button
          style={passButtonStyle}
          onClick={onPass}
          disabled={!canPass || !isMyTurn}
          title={!isMyTurn ? 'Not your turn' : !canPass ? 'You have a valid move' : 'Pass your turn'}
        >
          Pass
        </button>
      </div>
    </div>
  )
}
