const initialValue = {
    moves: [],
};

export default class Store {
    #state = initialValue;

    get game() {
        return "lorem";
    }

    constructor() {}

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
