import { GameState, Player } from "./types";

export function deriveGame(state: GameState) {
    const currentPlayer = players[state.currentGameMoves.length % players.length];

    let winner = undefined;

    for (const player of players) {
        const playerMoves = state.currentGameMoves
            .filter((move) => move.player.id === +player.id)
            .map((move) => move.squareId);

        for (const pattern of winPattern) {
            if (pattern.every((v) => playerMoves.includes(v))) {
                winner = player;
            }
        }
    }

    return {
        moves: state.currentGameMoves,
        currentPlayer,
        status: {
            isComplete: winner !== undefined || state.currentGameMoves.length === 9,
            winner,
        },
    };
}

export function deriveStats(state: GameState) {
    return {
        playerWithStats: players.map((player) => {
            const wins = state.history.currentRoundGames.filter((game) => game.status.winner?.id === player.id).length;

            return {
                ...player,
                wins,
            };
        }),
        ties: state.history.currentRoundGames.filter((game) => game.status.winner === undefined).length,
    };
}

const players: Player[] = [
    {
        id: 1,
        name: "Player 1",
        iconClass: "fa-x",
        colorClass: "turquoise",
    },
    {
        id: 2,
        name: "Player 2",
        iconClass: "fa-o",
        colorClass: "yellow",
    },
];

const winPattern = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9],
];
