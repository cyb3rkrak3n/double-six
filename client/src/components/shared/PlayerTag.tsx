interface Props {
  playerName: string
  isHost?: boolean
  isConnected?: boolean
  isCurrentTurn?: boolean
}

export function PlayerTag({
  playerName,
  isHost = false,
  isConnected = true,
  isCurrentTurn = false,
}: Props) {
  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    backgroundColor: isCurrentTurn ? '#1d4ed8' : '#f3f4f6',
    color: isCurrentTurn ? '#ffffff' : '#111827',
    fontWeight: isCurrentTurn ? 600 : 400,
    fontSize: '0.875rem',
    opacity: isConnected ? 1 : 0.5,
    border: `1px solid ${isCurrentTurn ? '#1d4ed8' : '#e5e7eb'}`,
    transition: 'all 0.15s',
  }

  return (
    <div style={containerStyle}>
      {isHost && <span title="Host">👑</span>}
      <span>{playerName}</span>
      {!isConnected && <span title="Disconnected">⚠️</span>}
    </div>
  )
}
