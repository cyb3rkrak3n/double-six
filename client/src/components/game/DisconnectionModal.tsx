interface Props {
  disconnectedPlayerName: string
  isHost: boolean
  onWait: () => void
  onContinue: () => void
  onEnd: () => void
}

export function DisconnectionModal({
  disconnectedPlayerName,
  isHost,
  onWait,
  onContinue,
  onEnd,
}: Props) {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  }

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '32px',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#f8fafc',
  }

  const messageStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 1.6,
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  }

  const buttonStyle = (variant: 'primary' | 'secondary' | 'danger'): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    width: '100%',
    backgroundColor:
      variant === 'primary' ? '#2563eb' :
      variant === 'danger' ? '#dc2626' :
      '#334155',
    color: '#ffffff',
  })

  const waitingStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#64748b',
    textAlign: 'center',
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={titleStyle}>⚠️ Player Disconnected</div>

        <div style={messageStyle}>
          <strong style={{ color: '#f8fafc' }}>{disconnectedPlayerName}</strong> has lost connection.
          The game is paused.
        </div>

        {isHost ? (
          <>
            <div style={messageStyle}>
              What would you like to do?
            </div>
            <div style={buttonGroupStyle}>
              <button style={buttonStyle('primary')} onClick={onWait}>
                Wait for reconnection
              </button>
              <button style={buttonStyle('secondary')} onClick={onContinue}>
                Continue without {disconnectedPlayerName}
              </button>
              <button style={buttonStyle('danger')} onClick={onEnd}>
                End game
              </button>
            </div>
          </>
        ) : (
          <div style={waitingStyle}>
            Waiting for the host to decide...
          </div>
        )}
      </div>
    </div>
  )
}
