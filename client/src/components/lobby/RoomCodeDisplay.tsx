interface Props {
  code: string
}

export function RoomCodeDisplay({ code }: Props) {
  return (
    <div>
      <strong>Room Code:</strong> {code}
    </div>
  )
}
