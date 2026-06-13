import { useState } from 'react'
import { useSocket } from '../../hooks/useSocket'

export function NameForm() {
  const { register, registered, playerName } = useSocket()
  const [name, setName] = useState('')

  if (registered) {
    return <p>Welcome, {playerName}!</p>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (name.trim()) register(name.trim())
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button type="submit">Continue</button>
    </form>
  )
}
