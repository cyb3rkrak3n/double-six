# Room Lifecycle

## Creation

- A player creates a room and becomes the **host**
- A unique room code is generated
- Host waits in a lobby

---

## Joining

- Up to 3 players join via room code
- Players see available **seats** (4 labeled positions around the table)
- Each player picks their seat — partners sit across (seats 1 & 3 vs seats 2 & 4)

---

## Lobby

- Host can **move players** between seats before starting
- Host hits **Start Game** once all 4 seats are filled

---

## In-Game

- Normal round play per the ruleset

---

## Disconnection

- Game **pauses** when a player disconnects, all players are notified
- Host options:
  - **Wait** — game stays paused; the disconnected player can rejoin via room code and returns to their original seat automatically
  - **Continue without player** — missing player's turns are auto-played (first valid tile in hand, with a brief delay so players can see the play). Continues until the match ends or the player rejoins. If the player rejoins mid-hand, they resume control on the next hand
  - **End game** — room is destroyed, no winner declared
- If the host disconnects, the next player in join order becomes host

---

## Round End

- Scores are updated and the next round starts with the appropriate player

---

## Match End

- A team hits 200 points, winner is declared
- Room is destroyed after acknowledgment

---

## Cleanup

- Room is destroyed on match end or when the host ends the game