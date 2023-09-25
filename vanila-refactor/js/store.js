const initialValue = {
    moves: [],
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

    get game() {
        const state = this.#getState();

        const currentPlayer =
            this.#players[state.moves.length % this.#players.length];

        return {
            moves: state.moves,
            currentPlayer,
        };
    }

    get gameStatus() {
        const state = this.#getState();

        let winner = undefined;

        for (const player of this.#players) {
            const playerMoves = state.moves
                .filter((move) => move.player.id === +player.id)
                .map((move) => move.squareId);

            for (const pattern of this.#winPattern) {
                if (pattern.every((v) => playerMoves.includes(v))) {
                    winner = player;
                }
            }
        }

        return {
            isComplete: winner !== undefined || state.moves.length === 9,
            winner,
        };
    }

    playerMove(squareId) {
        const state = this.#getState();

        const stateClone = structuredClone(state);
        stateClone.moves.push({
            squareId,
            player: this.game.currentPlayer,
        });

        this.#saveState(stateClone);
    }

    reset() {
        this.#saveState(initialValue);
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
