import { Server, Socket } from 'socket.io'
import { randomUUID } from 'crypto'
import { players, socketIds } from '../store/rooms'
import { RegisterPlayerPayload, PlayerRegisteredPayload } from '@double-six/shared'
import { registerRoomHandlers } from './room'
import { registerLobbyHandlers } from './lobby'
import { registerGameHandlers } from './game'
import { registerDisconnectionHandlers, handleReconnection } from './disconnection'

export function registerSocketHandlers(io: Server, socket: Socket) {
  socket.on('register_player', (payload: RegisterPlayerPayload) => {
    let player = payload.token ? players.get(payload.token) : undefined

    if (!player) {
      const playerId = randomUUID()
      const token = randomUUID()
      player = { playerId, token, playerName: payload.playerName }
      players.set(token, player)
    } else {
      player.playerName = payload.playerName
    }

    socket.data.playerId = player.playerId
    socket.data.token = player.token
    socket.data.playerName = player.playerName
    socketIds.set(player.playerId, socket.id)

    const response: PlayerRegisteredPayload = {
      playerId: player.playerId,
      token: player.token,
      playerName: player.playerName,
    }

    socket.emit('player_registered', response)

    handleReconnection(io, socket)
  })

  registerRoomHandlers(io, socket)
  registerLobbyHandlers(io, socket)
  registerGameHandlers(io, socket)
  registerDisconnectionHandlers(io, socket)
}
