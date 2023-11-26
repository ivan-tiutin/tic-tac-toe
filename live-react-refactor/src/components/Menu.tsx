import { useState } from "react";
import classNames from "classnames";
import "./Menu.css";

type Props = {
    onAction: (action: "reset" | "new-round") => void;
};

export default function Menu({ onAction }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prevState) => !prevState);
    };

    const onActionWrapper = (action: "reset" | "new-round") => {
        onAction(action);
        toggleMenu();
    };

    return (
        <div className="menu">
            <button onClick={toggleMenu} className="menu-btn">
                Action
                <i
                    className={classNames(
                        "fa-solid",
                        menuOpen ? "fa-chevron-up" : "fa-chevron-down"
                    )}
                ></i>
            </button>

            {menuOpen && (
                <div className="items border">
                    <button onClick={() => onActionWrapper("reset")}>
                        Reset
                    </button>
                    <button onClick={() => onActionWrapper("new-round")}>
                        New Round
                    </button>
                </div>
            )}
        </div>
    );
}
