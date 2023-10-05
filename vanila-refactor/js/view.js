export default class View {
    $ = {};
    $$ = {};

    constructor() {
        this.$.menu = this.#qs('[data-id="menu"]');
        this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
        this.$.menuItems = this.#qs('[data-id="menu-items"]');
        this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
        this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
        this.$.modal = this.#qs('[data-id="modal"]');
        this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
        this.$.modalText = this.#qs('[data-id="modal-text"]');
        this.$.turn = this.#qs('[data-id="turn"]');
        this.$.p1wins = this.#qs('[data-id="p1-wins"]');
        this.$.p2wins = this.#qs('[data-id="p2-wins"]');
        this.$.ties = this.#qs('[data-id="ties"]');

        this.$$.squares = this.#qsAll('[data-id="square"]');

        // UI-only event listeners
        this.$.menuBtn.addEventListener("click", (event) => {
            this.#toggleMenu();
        });
    }

    render(game, status, stats) {
        const { playerWithStats, ties } = stats;
        const { moves, currentPlayer } = game;
        const { isComplete, winner } = status;

        this.#closeAll();
        this.#clearMoves();

        this.#updateScoreBoard(
            playerWithStats[0].wins,
            playerWithStats[1].wins,
            ties
        );

        this.#initializeMoves(moves);

        if (isComplete) {
            this.#openModal(winner ? `${winner.name} wins!` : "Tie!");
            return;
        }

        this.#setTurnIndicator(currentPlayer);
    }

    // Register all the event listeners

    bindGameResetEvent(handler) {
        this.$.resetBtn.addEventListener("click", handler);
        this.$.modalBtn.addEventListener("click", handler);
    }

    bindNewRoundEvent(handler) {
        this.$.newRoundBtn.addEventListener("click", handler);
    }

    bindPlayerMoveEvent(handler) {
        this.$$.squares.forEach((square) => {
            square.addEventListener("click", (event) => handler(event, square));
        });
    }

    // DOM helper methods

    #updateScoreBoard(p1wins, p2wins, ties) {
        this.$.p1wins.innerText = `${p1wins} wins`;
        this.$.p2wins.innerText = `${p2wins} wins`;
        this.$.ties.innerText = `${ties}`;
    }

    #openModal(message) {
        this.$.modal.classList.remove("hidden");
        this.$.modalText.innerText = message;
    }

    #closeAll() {
        this.#closeModal();
        this.#closeMenu();
    }

    #clearMoves() {
        this.$$.squares.forEach((square) => {
            square.replaceChildren();
        });
    }

    #initializeMoves(moves) {
        this.$$.squares.forEach((square) => {
            const existingMove = moves.find(
                (move) => move.squareId === +square.id
            );

            if (existingMove) {
                this.#handlePlayerMove(square, existingMove.player);
            }
        });
    }

    #handlePlayerMove(squareElement, player) {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", player.iconClass, player.colorClass);
        squareElement.replaceChildren(icon);
    }

    #setTurnIndicator(player) {
        const icon = document.createElement("i");
        const label = document.createElement("p");

        icon.classList.add("fa-solid", player.iconClass, player.colorClass);
        label.classList.add(player.colorClass);
        label.innerText = `${player.name}, you are up!`;

        this.$.turn.replaceChildren(icon, label);
    }

    #closeModal() {
        this.$.modal.classList.add("hidden");
    }

    #closeMenu() {
        this.$.menuItems.classList.add("hidden");
        this.$.menuBtn.classList.remove("border");

        const icon = this.#qs("i", this.$.menuBtn);
        icon.classList.add("fa-chevron-down");
        icon.classList.remove("fa-chevron-up");
    }

    #toggleMenu() {
        this.$.menuItems.classList.toggle("hidden");
        this.$.menuBtn.classList.toggle("border");

        const icon = this.#qs("i", this.$.menuBtn);
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    }

    #qs(selector, parent) {
        const el = parent
            ? parent.querySelector(selector)
            : document.querySelector(selector);
        if (!el) {
            throw new Error("Could not find elements");
        }
        return el;
    }

    #qsAll(selector) {
        const elList = document.querySelectorAll(selector);
        if (!elList) {
            throw new Error("Could not find elements");
        }
        return elList;
    }
}
