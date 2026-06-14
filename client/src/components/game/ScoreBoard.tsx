import type { Match, Room } from '@double-six/shared'

interface Props {
  match: Match
  room: Room
  myPlayerId: string | null
}

function getTeamLabel(team: 'A' | 'B', room: Room): string {
  const seatNumbers = team === 'A' ? [1, 3] : [2, 4]
  const names = seatNumbers
    .map((n) => room.seats.find((s) => s.seatNumber === n)?.playerName ?? '?')
    .join(' & ')
  return names
}

function getMyTeam(room: Room, myPlayerId: string | null): 'A' | 'B' | null {
  const seat = room.seats.find((s) => s.playerId === myPlayerId)
  if (!seat) return null
  return [1, 3].includes(seat.seatNumber) ? 'A' : 'B'
}

export function ScoreBoard({ match, room, myPlayerId }: Props) {
  const myTeam = getMyTeam(room, myPlayerId)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    borderRadius: '10px',
    gap: '16px',
  }

  const teamBlockStyle = (team: 'A' | 'B'): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: myTeam === team ? '#1d4ed8' : '#334155',
    minWidth: '140px',
  })

  const scoreStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1,
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textAlign: 'center',
  }

  const roundStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#94a3b8',
    textAlign: 'center',
  }

  return (
    <div style={containerStyle}>
      <div style={teamBlockStyle('A')}>
        <div style={scoreStyle}>{match.teams.A.score}</div>
        <div style={labelStyle}>{getTeamLabel('A', room)}</div>
        {myTeam === 'A' && <div style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Your team</div>}
      </div>

      <div style={roundStyle}>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ROUND</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
          {match.roundNumber}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>First to {match.targetScore}</div>
      </div>

      <div style={teamBlockStyle('B')}>
        <div style={scoreStyle}>{match.teams.B.score}</div>
        <div style={labelStyle}>{getTeamLabel('B', room)}</div>
        {myTeam === 'B' && <div style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Your team</div>}
      </div>
    </div>
  )
}
