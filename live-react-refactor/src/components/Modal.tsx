import "./Modal.css";

type Props = {
    message: string;
};

export default function Modal({ message }: Props) {
    return (
        <div className="modal">
            <div className="modal-content">
                <p>{message}</p>
                <button>Play again</button>
            </div>
        </div>
    );
}
