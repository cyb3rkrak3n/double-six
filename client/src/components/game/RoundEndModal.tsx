import type { Match } from '@double-six/shared'

interface Props {
  winnerSeat: number | null
  scoreDelta: number
  match: Match
  isHost: boolean
  onNextRound: () => void
}

export function RoundEndModal({ winnerSeat, scoreDelta, match, isHost, onNextRound }: Props) {
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

  const scoreRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  }

  const teamScoreStyle = (_team: 'A' | 'B'): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  })

  const bigScoreStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#f8fafc',
  }

  const teamLabelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  const deltaBadgeStyle: React.CSSProperties = {
    padding: '4px 12px',
    borderRadius: '999px',
    backgroundColor: scoreDelta > 0 ? '#166534' : '#374151',
    color: scoreDelta > 0 ? '#4ade80' : '#94a3b8',
    fontSize: '0.875rem',
    fontWeight: 600,
  }

  const nextRoundButtonStyle: React.CSSProperties = {
    padding: '10px 28px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  }

  const waitingStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#64748b',
  }

  const isBlocked = winnerSeat === null
  const isTie = scoreDelta === 0

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={titleStyle}>
          {isBlocked
            ? isTie
              ? '🤝 Tie Game'
              : '🔒 Blocked!'
            : '🏆 Round Over!'}
        </div>

        {isBlocked && (
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', textAlign: 'center' }}>
            {isTie
              ? 'No points awarded — same pip count'
              : 'No valid moves remaining'}
          </div>
        )}

        <div style={deltaBadgeStyle}>
          {scoreDelta > 0 ? `+${scoreDelta} points` : 'No points scored'}
        </div>

        <div style={scoreRowStyle}>
          <div style={teamScoreStyle('A')}>
            <div style={bigScoreStyle}>{match.teams.A.score}</div>
            <div style={teamLabelStyle}>Team A</div>
          </div>
          <div style={{ color: '#475569', fontSize: '1.5rem' }}>—</div>
          <div style={teamScoreStyle('B')}>
            <div style={bigScoreStyle}>{match.teams.B.score}</div>
            <div style={teamLabelStyle}>Team B</div>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Round {match.roundNumber} of {match.targetScore} target
        </div>

        {isHost ? (
          <button style={nextRoundButtonStyle} onClick={onNextRound}>
            Next Round
          </button>
        ) : (
          <div style={waitingStyle}>Waiting for host to start next round...</div>
        )}
      </div>
    </div>
  )
}
