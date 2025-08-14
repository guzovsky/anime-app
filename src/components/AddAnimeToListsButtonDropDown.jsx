import AnimeContext from "../contexts/AnimeContext";
import { useRef, useEffect, useContext, useState } from "react";
import { BookmarkX, CircleMinus, CirclePlus, Plus, Check } from 'lucide-react';

function AddAnimeToListsButtonDropDown({ anime }) {
    const {
        customLists,
        setCustomLists,
        addAnimeToListsButtonDropDownIsOpen,
        setAddAnimeToListsButtonDropDownIsOpen,
        createCustomList,
    } = useContext(AnimeContext);

    const [createNewListInputValue, setCreateNewListInputValue] = useState("")

    const [isCreatingANewList, setIsCreatingANewList] = useState(false)

    const dropdownRef = useRef(null);

    const handleChange = (e) => {
        setCreateNewListInputValue(e.target.value);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setAddAnimeToListsButtonDropDownIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {addAnimeToListsButtonDropDownIsOpen === anime.mal_id && (
                <div ref={dropdownRef} className="add-anime-to-lists-dropdown">
                    <div>
                        <p>Would you like to add:<span>{anime.title}</span>to any of your lists?</p>
                        <button className="close-add-anime-to-lists-dropdown-btn" onClick={() => setAddAnimeToListsButtonDropDownIsOpen(null)}>
                            <BookmarkX />
                        </button>
                    </div>

                    <div>
                        {!isCreatingANewList ? (
                            <>
                                {customLists.length > 0 ?
                                    <h3>- Your lists:</h3> :
                                    <h3>- You don't have any Custom Lists yet. Try creating some!</h3>
                            }
                                
                                <button onClick={() => setIsCreatingANewList(true)} className="dropdown-create-new-list-btn"><Plus /></button>
                            </>
                        ) : (
                            <>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        createCustomList(createNewListInputValue);
                                        setIsCreatingANewList(false);
                                        setCreateNewListInputValue("");
                                    }}
                                >
                                    <input
                                        placeholder="Your new list name..."
                                        type="text"
                                        value={createNewListInputValue}
                                        onChange={handleChange}
                                        autoFocus
                                    />

                                </form>

                                <button
                                    className="dropdown-create-new-list-btn"
                                    onClick={() => {
                                        createCustomList(createNewListInputValue);
                                        setIsCreatingANewList(false);
                                        setCreateNewListInputValue("");
                                    }}
                                >
                                    <Check />
                                </button>
                            </>
                        )}
                    </div>

                    {customLists.map((list, index) => {
                        const isAlreadyInList = list.anime.some(a => a.mal_id === anime.mal_id);

                        return (
                            <div key={index} style={{ position: "relative", overflow: "visible" }}>
                                <button
                                    className={`option-btn ${isAlreadyInList ? "already-added" : ""}`}
                                    onClick={() => {
                                        if (!isAlreadyInList) {
                                            setCustomLists(prevLists =>
                                                prevLists.map((l, i) =>
                                                    i === index
                                                        ? { ...l, anime: [...l.anime, anime] }
                                                        : l
                                                )
                                            );
                                        } else {
                                            setCustomLists(prevLists =>
                                                prevLists.map((l, i) =>
                                                    i === index
                                                        ? { ...l, anime: l.anime.filter(a => a.mal_id !== anime.mal_id) }
                                                        : l
                                                )
                                            );
                                        }
                                    }}
                                >
                                    {list.name}

                                    {isAlreadyInList ? (
                                        <span><CircleMinus /></span>
                                    ) : (
                                        <span><CirclePlus /></span>
                                    )}
                                </button>

                            </div>

                        );
                    })}
                </div>
            )}
        </>
    );
}

export default AddAnimeToListsButtonDropDown;
