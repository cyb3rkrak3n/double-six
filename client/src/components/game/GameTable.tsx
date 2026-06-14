import type { Room, Tile, PlayerView } from '@double-six/shared'
import { BoardChain } from './BoardChain'
import { OpponentArea } from './OpponentArea'
import { SidePlayer } from './SidePlayer'
import { LocalPlayerArea } from './LocalPlayerArea'

interface Props {
  playerView: PlayerView
  myPlayerId: string | null
  playerName: string
  moveError: string | null
  onPlay: (tile: Tile, orientation: 'normal' | 'flipped') => void
  onPass: () => void
}

function getRelativeSeat(mySeatNumber: number, position: 'across' | 'left' | 'right'): number {
  if (position === 'across') return mySeatNumber === 1 ? 3 : mySeatNumber === 3 ? 1 : mySeatNumber === 2 ? 4 : 2
  if (position === 'left') return mySeatNumber === 1 ? 4 : mySeatNumber === 2 ? 1 : mySeatNumber === 3 ? 2 : 3
  if (position === 'right') return mySeatNumber === 1 ? 2 : mySeatNumber === 2 ? 3 : mySeatNumber === 3 ? 4 : 1
  return mySeatNumber
}

export function GameTable({
  playerView,
  myPlayerId,
  playerName,
  moveError,
  onPlay,
  onPass,
}: Props) {
  const { room, hand, myTiles, opponentTileCounts } = playerView

  const mySeat = room.seats.find((s) => s.playerId === myPlayerId)
  const mySeatNumber = mySeat?.seatNumber ?? 1

  const acrossSeatNumber = getRelativeSeat(mySeatNumber, 'across')
  const leftSeatNumber = getRelativeSeat(mySeatNumber, 'left')
  const rightSeatNumber = getRelativeSeat(mySeatNumber, 'right')

  const acrossSeat = room.seats.find((s) => s.seatNumber === acrossSeatNumber)!
  const leftSeat = room.seats.find((s) => s.seatNumber === leftSeatNumber)!
  const rightSeat = room.seats.find((s) => s.seatNumber === rightSeatNumber)!

  const isMyTurn = hand.currentTurnSeat === mySeatNumber

  const currentTurnSeat = room.seats.find((s) => s.seatNumber === hand.currentTurnSeat)
  const currentPlayerName = currentTurnSeat?.playerName ?? '?'

  const canPass = !myTiles.some((t) =>
    t.left === hand.openEnds.left ||
    t.right === hand.openEnds.left ||
    t.left === hand.openEnds.right ||
    t.right === hand.openEnds.right ||
    (hand.openEnds.left === -1 && t.left === 6 && t.right === 6)
  )

  const outerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateColumns: 'auto 1fr auto',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#0f172a',
    borderRadius: '12px',
    minHeight: '500px',
  }

  return (
    <div style={outerStyle}>
      <div style={{ gridColumn: '1 / 4', display: 'flex', justifyContent: 'center' }}>
        <OpponentArea
          seat={acrossSeat}
          tileCount={opponentTileCounts[acrossSeatNumber] ?? 0}
          isCurrentTurn={hand.currentTurnSeat === acrossSeatNumber}
          isHost={room.hostId === acrossSeat.playerId}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SidePlayer
          seat={leftSeat}
          tileCount={opponentTileCounts[leftSeatNumber] ?? 0}
          isCurrentTurn={hand.currentTurnSeat === leftSeatNumber}
          isHost={room.hostId === leftSeat.playerId}
          side="left"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BoardChain chain={hand.chain} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SidePlayer
          seat={rightSeat}
          tileCount={opponentTileCounts[rightSeatNumber] ?? 0}
          isCurrentTurn={hand.currentTurnSeat === rightSeatNumber}
          isHost={room.hostId === rightSeat.playerId}
          side="right"
        />
      </div>

      <div style={{ gridColumn: '1 / 4' }}>
        <LocalPlayerArea
          playerName={playerName}
          isHost={room.hostId === myPlayerId}
          isMyTurn={isMyTurn}
          tiles={myTiles}
          openEnds={hand.openEnds}
          currentPlayerName={currentPlayerName}
          canPass={canPass}
          moveError={moveError}
          onPlay={onPlay}
          onPass={onPass}
        />
      </div>
    </div>
  )
}
