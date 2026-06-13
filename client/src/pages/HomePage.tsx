import { useSocket } from '../hooks/useSocket'
import { NameForm } from '../components/home/NameForm'
import { CreateRoomButton } from '../components/home/CreateRoomButton'
import { JoinRoomForm } from '../components/home/JoinRoomForm'

export function HomePage() {
  const { registered } = useSocket()

  return (
    <div>
      <h1>Double Six</h1>
      <NameForm />
      {registered && (
        <div>
          <CreateRoomButton />
          <JoinRoomForm />
        </div>
      )}
    </div>
  )
}
