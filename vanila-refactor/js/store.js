const initialValue = {
    currentGameMoves: [],
    history: {
        currentRoundGames: [],
        allGames: [],
    },
};

export default class Store {
    #state = initialValue;
    #allPlayers = undefined;
    #winingPattern = [
        [1, 2, 3],
        [1, 5, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 5, 7],
        [3, 6, 9],
        [4, 5, 6],
        [7, 8, 9],
    ];

    constructor(players) {
        this.#players = players;
    }

    get stats() {
        const state = this.#getState();
        return {
            playerWithStats: this.#allPlayers.map((player) => {
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
            this.#players[state.currentGameMoves.length % this.#players.length];

        return {
            moves: state.currentGameMoves,
            currentPlayer,
        };
    }

    get gameStatus() {
        const state = this.#getState();

        let winner = undefined;

        for (const player of this.#players) {
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

    playerMove(squareId) {
        const stateClone = structuredClone(this.#getState());
        stateClone.currentGameMoves.push({
            squareId,
            player: this.game.currentPlayer,
        });

        this.#saveState(stateClone);
    }

    reset() {
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

    get #winPattern() {
        return this.#winingPattern;
    }

    get #players() {
        return this.#allPlayers;
    }

    set #players(value) {
        this.#allPlayers = value;
    }

    #getState() {
        return this.#state;
    }

    #saveState(stateOrFunction) {
        const prevState = this.#state;
        let newState;

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

        this.#state = newState;
    }
}
