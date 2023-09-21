const initialValue = {
    moves: [],
};

export default class Store {
    #state = initialValue;

    constructor(players) {
        this.players = players;
    }

    get game() {
        const state = this.#getState();

        const currentPlayer =
            this.players[state.moves.length % this.players.length];

        return {
            currentPlayer,
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
