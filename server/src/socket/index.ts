import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { players } from '../store/rooms'
import { RegisterPlayerPayload, PlayerRegisteredPayload } from '@double-six/shared'
import { registerRoomHandlers } from './room'

export function registerSocketHandlers(io: Server, socket: Socket) {
  socket.on('register_player', (payload: RegisterPlayerPayload) => {
    let player = payload.token ? players.get(payload.token) : undefined

    if (!player) {
      const playerId = uuidv4()
      const token = uuidv4()
      player = { playerId, token, playerName: payload.playerName }
      players.set(token, player)
    } else {
      player.playerName = payload.playerName
    }

    socket.data.playerId = player.playerId
    socket.data.token = player.token
    socket.data.playerName = player.playerName

    const response: PlayerRegisteredPayload = {
      playerId: player.playerId,
      token: player.token,
      playerName: player.playerName,
    }
    socket.emit('player_registered', response)
  })

  registerRoomHandlers(io, socket)
}
