export type setTheme = (themes: 'colorful' | 'circles' | 'tropical' | 'warm' | 'dark') => void

export interface Session {
    game: string
    won: boolean
    score: number
    remainingHeart: number
    player: Player

    setScore: (score: number) => void
    removeHeart: () => void
    endGame: () => void
}

export type logSession = (session: Session) => void
export type logSession = (score: number) => void

export interface Player {
    wins: number
    loss: number
    totalScore: number
    highScore: number
    name: string
    sessions: Session[]
    logSession: logSession
    setScore: setScore
}

export interface Word {
    name: string
    url: string
    difficulty?: 'basic' | 'intermediate' | 'advanced'
}

export interface Game {
    session: Session
    theme: 'warm' | 'circles' | 'tropical' | 'dark' | 'colorful'
    currentWord: Word
    currentLevel: 0

    gameFrame: HTMLDivElement
    welcomeScreen: HTMLDivElement
    winningScreen: HTMLDivElement
    gamesOverScreen: HTMLDivElement
    skipButton: HTMLDivElement
    nextButton: HTMLDivElement
    navBar: HTMLDivElement
    logo: HTMLDivElement
}