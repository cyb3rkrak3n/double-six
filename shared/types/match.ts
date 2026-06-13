export interface Match{
    teams: {
        A: { seatNumbers: [1, 3], score: number }
        B: { seatNumbers: [2, 4], score: number }
    }
    roundNumber: number
    targetScore: number
    lastRoundWinnerSeat: number | null
}