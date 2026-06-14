interface Props {
  isMyTurn: boolean
  currentPlayerName: string
}

export function TurnIndicator({ isMyTurn, currentPlayerName }: Props) {
  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    backgroundColor: isMyTurn ? '#dcfce7' : '#f3f4f6',
    color: isMyTurn ? '#15803d' : '#6b7280',
    border: `1px solid ${isMyTurn ? '#86efac' : '#e5e7eb'}`,
    transition: 'all 0.15s',
  }

  const dotStyle: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: isMyTurn ? '#16a34a' : '#9ca3af',
    animation: isMyTurn ? 'pulse 1.5s infinite' : 'none',
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <div style={containerStyle}>
        <div style={dotStyle} />
        {isMyTurn ? 'Your turn' : `${currentPlayerName}'s turn`}
      </div>
    </>
  )
}
