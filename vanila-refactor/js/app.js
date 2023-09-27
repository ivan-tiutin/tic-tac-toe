import View from "./view.js";
import Store from "./store.js";

const App = {
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
        modal: document.querySelector('[data-id="modal"]'),
        modalBtn: document.querySelector('[data-id="modal-btn"]'),
        modalText: document.querySelector('[data-id="modal-text"]'),
        turn: document.querySelector('[data-id="turn"]'),
        winingPattern: [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
        ],
    },
    state: {
        moves: [],
    },
    init() {
        App.registerEventListeners();
    },
    getGameStatus(moves) {
        const p1Moves = moves.map((move) => {
            if (move.playerId === 1) {
                return move.squareId;
            }
        });
        const p2Moves = moves.map((move) => {
            if (move.playerId === 2) {
                return move.squareId;
            }
        });

        let winner = null;
        App.$.winingPattern.forEach((patter) => {
            const p1Wins = patter.every((v) => p1Moves.includes(v));
            const p2Wins = patter.every((v) => p2Moves.includes(v));

            if (p1Wins) {
                winner = 1;
            }

            if (p2Wins) {
                winner = 2;
            }
        });

        return {
            status: moves.length === 9 || winner ? "complete" : "in-progress", // in-progress | complete
            winner, // 1 | 2 | null
        };
    },
    onSquareClick(square) {
        const hasMove = (squareId) => {
            const existingMove = App.state.moves.find(
                (move) => move.squareId === squareId
            );

            return !!existingMove;
        };

        if (hasMove(+square.id)) {
            return;
        }

        const lastMove = App.state.moves.at(-1);
        getOppositePlayer = (player) => (player === 1 ? 2 : 1);
        const currentPlayer =
            App.state.moves.length === 0
                ? 1
                : getOppositePlayer(lastMove.playerId);
        const nextPlayer = getOppositePlayer(currentPlayer);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.querySelector("p");
        turnLabel.textContent = `Player ${nextPlayer}, you are up!`;

        if (currentPlayer === 1) {
            squareIcon.classList.add("fa-solid", "fa-x", "yellow");
            turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
            turnLabel.classList = "turquoise";
        } else {
            squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
            turnIcon.classList.add("fa-solid", "fa-x", "yellow");
            turnLabel.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
            squareId: +square.id,
            playerId: currentPlayer,
        });

        square.replaceChildren(squareIcon);

        const { status, winner } = App.getGameStatus(App.state.moves);
        if (status === "complete") {
            App.$.modal.classList.remove("hidden");
            if (winner) {
                App.$.modalText.textContent = `Player ${winner} wins!`;
            } else {
                App.$.modalText.textContent = "Tie game!";
            }
        }
    },
    registerEventListeners(square) {
        App.$.menu.addEventListener("click", (event) => {
            App.$.menuItems.classList.toggle("hidden");
        });

        App.$.resetBtn.addEventListener("click", (event) => {
            console.log("reset button");
        });

        App.$.newRoundBtn.addEventListener("click", (event) => {
            console.log("new round button");
        });

        App.$.squares.forEach((square) => {
            square.addEventListener("click", (_) => {
                App.onSquareClick(square);
            });
        });

        App.$.modalBtn.addEventListener("click", () => {
            App.state.moves = [];
            App.$.squares.forEach((square) => {
                square.replaceChildren();
            });
            App.$.modal.classList.add("hidden");
        });
    },
};

// window.addEventListener("load", App.init);

const players = [
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
    const store = new Store(players);

    view.bindGameResetEvent((event) => {
        view.closeAll();

        store.reset();
        view.clearMoves();

        view.setTurnIndicator(store.game.currentPlayer);

        const players = store.stats.playerWithStats;
        view.updateScoreBoard(
            players[0].wins,
            players[1].wins,
            store.stats.ties
        );
    });

    view.bindNewRoundEvent((event) => {
        console.log("New round event");
        console.log(event);
    });

    view.bindPlayerMoveEvent((event, square) => {
        const existingMove = store.game.moves.find(
            (move) => move.squareId === +square.id
        );

        if (existingMove) {
            return;
        }

        view.handlePlayerMove(square, store.game.currentPlayer);

        store.playerMove(+square.id);

        if (store.gameStatus.isComplete) {
            const winner = store.gameStatus.winner;

            view.openModal(winner ? `${winner.name} wins!` : "Tie!");
            return;
        }

        view.setTurnIndicator(store.game.currentPlayer);
    });
}

window.addEventListener("load", init);
