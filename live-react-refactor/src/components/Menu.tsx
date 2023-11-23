import "./Menu.css";

export default function Menu() {
    return (
        <div className="menu">
            <button className="menu-btn">
                Action
                <i className="fa-solid fa-chevron-down"></i>
            </button>

            <div className="items border hidden">
                <button>Reset</button>
                <button>New Round</button>
            </div>
        </div>
    );
}
