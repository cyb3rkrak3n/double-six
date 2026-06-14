import { useEffect, useState } from 'react'
import { useSocket } from './useSocket'
import type {
  PlayerView,
  Tile,
  GameStartedPayload,
  StateUpdatedPayload,
  MoveErrorPayload,
} from '@double-six/shared'

export function useGame() {
  const { socket } = useSocket()
  const [playerView, setPlayerView] = useState<PlayerView | null>(null)
  const [moveError, setMoveError] = useState<string | null>(null)

  useEffect(() => {
    if (!socket) return

    const onGameStarted = (payload: GameStartedPayload) => {
      setPlayerView(payload.playerView)
      setMoveError(null)
    }
    const onStateUpdated = (payload: StateUpdatedPayload) => {
      setPlayerView(payload.playerView)
      setMoveError(null)
    }
    const onMoveError = (payload: MoveErrorPayload) => {
      setMoveError(payload.message)
    }

    socket.on('game_started', onGameStarted)
    socket.on('state_updated', onStateUpdated)
    socket.on('move_error', onMoveError)

    return () => {
      socket.off('game_started', onGameStarted)
      socket.off('state_updated', onStateUpdated)
      socket.off('move_error', onMoveError)
    }
  }, [socket])

  function placeTile(tile: Tile, orientation: 'normal' | 'flipped') {
    setMoveError(null)
    socket?.emit('place_tile', { tile, orientation })
  }

  function passTurn() {
    setMoveError(null)
    socket?.emit('pass_turn')
  }

  return { playerView, moveError, placeTile, passTurn }
}
