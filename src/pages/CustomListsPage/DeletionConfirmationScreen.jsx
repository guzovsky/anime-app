import { useContext, useRef } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import { CSSTransition } from "react-transition-group";

function DeletionConfirmationScreen({ deletionConfirmationScreenIsOpen, setDeletionConfirmationScreenIsOpen, deleteCustomList, list }) {
    return (
        deletionConfirmationScreenIsOpen && (
            <div className="deletion-confirmation-overlay" onClick={() => { setDeletionConfirmationScreenIsOpen(false) }}>
                <div className="deletion-confirmation-container">
                    <h1>Are you sure you want to delete your <span>{list.name}</span> Anime list?</h1>
                    <div className="deletion-confirmation-buttons">
                        <div>
                            <button onClick={() => { deleteCustomList(list.id) }}>YES</button>
                        </div>
                        <div>
                            <button>NO</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}

export default DeletionConfirmationScreen