export type Player = {
    id: number;
    name: string;
    iconClass: string;
    colorClass: string;
};

export type Move = {
    squareId: number;
    player: Player;
};

export type GameStatus = {
    isComplete: boolean;
    winner?: Player;
};

export type Game = {
    moves: Move[];
    status: GameStatus;
};

export type CurrentGameState = {
    moves: Move[];
    currentPlayer: Player;
};

export type GameState = {
    currentGameMoves: Move[];
    history: {
        currentRoundGames: Game[];
        allGames: Game[];
    };
};

export type PlayerWithStats = {
    wins: number;
    id: number;
    name: string;
    iconClass: string;
    colorClass: string;
};

export type GameStats = {
    playerWithStats: PlayerWithStats[];
    ties: number;
};
