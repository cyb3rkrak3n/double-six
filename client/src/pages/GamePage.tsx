import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Match } from '@double-six/shared'
import { useSocket } from '../hooks/useSocket'
import { useGame } from '../hooks/useGame'
import { ScoreBoard } from '../components/game/ScoreBoard'
import { GameTable } from '../components/game/GameTable'
import { RoundEndModal } from '../components/game/RoundEndModal'
import { DisconnectionModal } from '../components/game/DisconnectionModal'

interface RoundEndState {
  winnerSeat: number | null
  scoreDelta: number
  match: Match
}

interface DisconnectionState {
  seatNumber: number
  playerName: string
}

export function GamePage() {
  const { code } = useParams<{ code: string }>()
  const { socket, playerId, playerName } = useSocket()
  const { playerView, moveError, placeTile, passTurn } = useGame()
  const navigate = useNavigate()

  const [roundEnd, setRoundEnd] = useState<RoundEndState | null>(null)
  const [disconnection, setDisconnection] = useState<DisconnectionState | null>(null)

  useEffect(() => {
    if (!socket) return

    const onRoundEnded = (payload: RoundEndState) => {
      setRoundEnd(payload)
    }

    const onRoundStarted = () => {
      setRoundEnd(null)
    }

    const onMatchEnded = (payload: { winningTeam: 'A' | 'B'; match: Match }) => {
      setRoundEnd(null)
      navigate(`/?matchEnded=true&winner=${payload.winningTeam}`)
    }

    const onPlayerDisconnected = (payload: DisconnectionState) => {
      setDisconnection(payload)
    }

    const onPlayerReconnected = () => {
      setDisconnection(null)
    }

    const onGameEnded = () => {
      navigate('/')
    }

    socket.on('round_ended', onRoundEnded)
    socket.on('round_started', onRoundStarted)
    socket.on('match_ended', onMatchEnded)
    socket.on('player_disconnected', onPlayerDisconnected)
    socket.on('player_reconnected', onPlayerReconnected)
    socket.on('game_ended', onGameEnded)

    return () => {
      socket.off('round_ended', onRoundEnded)
      socket.off('round_started', onRoundStarted)
      socket.off('match_ended', onMatchEnded)
      socket.off('player_disconnected', onPlayerDisconnected)
      socket.off('player_reconnected', onPlayerReconnected)
      socket.off('game_ended', onGameEnded)
    }
  }, [socket, navigate])

  function handleNextRound() {
    socket?.emit('start_game')
  }

  function handleHostDecision(decision: 'wait' | 'continue' | 'end') {
    socket?.emit('host_decision', { decision })
    if (decision === 'wait' || decision === 'continue') {
      setDisconnection(null)
    }
  }

  if (!playerView) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        fontSize: '1rem',
      }}>
        Loading game...
      </div>
    )
  }

  const isHost = playerView.room.hostId === playerId

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
  }

  return (
    <div style={containerStyle}>
      <ScoreBoard
        match={playerView.match}
        room={playerView.room}
        myPlayerId={playerId}
      />
      <GameTable
        playerView={playerView}
        myPlayerId={playerId}
        playerName={playerName ?? '?'}
        moveError={moveError}
        onPlay={placeTile}
        onPass={passTurn}
      />

      {roundEnd && (
        <RoundEndModal
          winnerSeat={roundEnd.winnerSeat}
          scoreDelta={roundEnd.scoreDelta}
          match={roundEnd.match}
          isHost={isHost}
          onNextRound={handleNextRound}
        />
      )}

      {disconnection && (
        <DisconnectionModal
          disconnectedPlayerName={disconnection.playerName}
          isHost={isHost}
          onWait={() => handleHostDecision('wait')}
          onContinue={() => handleHostDecision('continue')}
          onEnd={() => handleHostDecision('end')}
        />
      )}
    </div>
  )
}
