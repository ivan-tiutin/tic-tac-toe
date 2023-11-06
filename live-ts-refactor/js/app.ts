import View from "./view";
import Store from "./store";
import { Player } from "./types";

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

function init() {
    const view = new View();
    const store = new Store("live-t3-storage-key", players);

    view.bindGameResetEvent((event) => {
        store.reset();
    });

    view.bindNewRoundEvent((event) => {
        store.newRound();
    });

    view.bindPlayerMoveEvent((square) => {
        const existingMove = store.game.moves.find(
            (move) => move.squareId === +square.id
        );

        if (existingMove) {
            return;
        }

        store.playerMove(+square.id);
    });

    // current tab state changes
    store.addEventListener("statechange", () => {
        view.render(store.game, store.gameStatus, store.stats);
    });

    // different tab state changes
    window.addEventListener("storage", () => {
        view.render(store.game, store.gameStatus, store.stats);
    });

    // the first load of the document
    view.render(store.game, store.gameStatus, store.stats);
}

window.addEventListener("load", init);
