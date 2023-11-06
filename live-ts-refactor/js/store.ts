import { GameState, GameStats, GameStatus, Player } from "./types";

const initialValue: GameState = {
    currentGameMoves: [],
    history: {
        currentRoundGames: [],
        allGames: [],
    },
};

type SaveStateCb = (prevState: GameState) => GameState;

export default class Store extends EventTarget {
    private winingPattern = [
        [1, 2, 3],
        [1, 5, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 5, 7],
        [3, 6, 9],
        [4, 5, 6],
        [7, 8, 9],
    ];

    constructor(
        private readonly storageKey: string,
        private readonly players: Player[]
    ) {
        super();
    }

    get stats(): GameStats {
        const state = this.#getState();
        return {
            playerWithStats: this.players.map((player) => {
                const wins = state.history.currentRoundGames.filter(
                    (game) => game.status.winner?.id === player.id
                ).length;

                return {
                    ...player,
                    wins,
                };
            }),
            ties: state.history.currentRoundGames.filter(
                (game) => game.status.winner === undefined
            ).length,
        };
    }

    get game() {
        const state = this.#getState();

        const currentPlayer =
            this.players[state.currentGameMoves.length % this.players.length];

        return {
            moves: state.currentGameMoves,
            currentPlayer,
        };
    }

    get gameStatus(): GameStatus {
        const state = this.#getState();

        let winner = undefined;

        for (const player of this.players) {
            const playerMoves = state.currentGameMoves
                .filter((move) => move.player.id === +player.id)
                .map((move) => move.squareId);

            for (const pattern of this.#winPattern) {
                if (pattern.every((v) => playerMoves.includes(v))) {
                    winner = player;
                }
            }
        }

        return {
            isComplete:
                winner !== undefined || state.currentGameMoves.length === 9,
            winner,
        };
    }

    playerMove(squareId: number): void {
        const stateClone = structuredClone(this.#getState());
        stateClone.currentGameMoves.push({
            squareId,
            player: this.game.currentPlayer,
        });

        this.#saveState(stateClone);
    }

    reset(): void {
        const stateClone = structuredClone(this.#getState());
        const { moves } = this.game;
        const status = this.gameStatus;

        if (status.isComplete) {
            stateClone.history.currentRoundGames.push({
                moves,
                status: status,
            });
        }

        stateClone.currentGameMoves = [];

        this.#saveState(stateClone);
    }

    newRound() {
        this.reset();

        const stateClone = structuredClone(this.#getState());
        stateClone.history.allGames.push(
            ...stateClone.history.currentRoundGames
        );

        stateClone.history.currentRoundGames = [];

        this.#saveState(stateClone);
    }

    get #winPattern() {
        return this.winingPattern;
    }

    #getState(): GameState {
        const item = window.localStorage.getItem(this.storageKey);
        return item ? (JSON.parse(item) as GameState) : initialValue;
    }

    #saveState(stateOrFunction: GameState | SaveStateCb) {
        const prevState = this.#getState();
        let newState: GameState;

        switch (typeof stateOrFunction) {
            case "function":
                newState = stateOrFunction(prevState);
                break;
            case "object":
                newState = stateOrFunction;
                break;
            default:
                throw new Error("Invalid argument passed to saveState");
        }

        window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
        this.dispatchEvent(new Event("statechange"));
    }
}
