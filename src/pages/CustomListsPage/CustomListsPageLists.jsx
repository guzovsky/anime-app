import { SquarePen, Trash, Expand, Pencil } from 'lucide-react';
import AnimeContext from "../../contexts/AnimeContext"
import { useContext, useState, useRef, useEffect } from "react"
import AnimeCardForCustomListsPage from './AnimeCardForCustomListsPage';
import DeletionConfirmationScreen from "./DeletionConfirmationScreen"
import React from 'react';
import { Link } from "react-router-dom";

function CustomListsPageLists() {
    const {
        customLists,
        editingListId,
        setEditingListId,
        deleteCustomList,
        isFavorite,
        handleAddToFavorites,
        editListName,
        isEditingAnimeInList,
        setIsEditingAnimeInList,
    } = useContext(AnimeContext);

    const [listIdToDelete, setListIdToDelete] = useState(null);
    const [editListIdInputValue, setEditListIdInputValue] = useState("");

    const handleChange = (e) => {
        setEditListIdInputValue(e.target.value);
    };

    const onSubmit = (listId) => {
        editListName(editListIdInputValue, listId);
        setEditListIdInputValue("");
        setEditingListId(null);
    };

    const listRefs = useRef({});

    useEffect(() => {
        function handleClick(e) {
            if (!isEditingAnimeInList) return;

            const activeListRef = listRefs.current[isEditingAnimeInList];
            if (
                activeListRef &&
                !activeListRef.contains(e.target) &&
                !e.target.closest('.edit-list-button')
            ) {
                setIsEditingAnimeInList(null);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isEditingAnimeInList, setIsEditingAnimeInList]);

    return (
        <>
            <div className="custom-list-container">
                {customLists.map((list) => (
                    <React.Fragment key={list.id}>

                        <DeletionConfirmationScreen
                            list={list}
                            deleteCustomList={deleteCustomList}
                            deletionConfirmationScreenIsOpen={listIdToDelete === list.id}
                            setDeletionConfirmationScreenIsOpen={(isOpen) => {
                                if (!isOpen) setListIdToDelete(null);
                            }}
                        />

                        <div className="custom-list">
                            <div className="custom-list-title-container">
                                {editingListId === list.id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            onSubmit(list.id);
                                        }}
                                    >
                                        <input
                                            maxLength={80}
                                            placeholder='Type the new name here...'
                                            type="text"
                                            value={editListIdInputValue}
                                            onChange={handleChange}
                                            onBlur={() => onSubmit(list.id)}
                                            autoFocus
                                        />
                                    </form>
                                ) : (
                                    <>
                                        <h2>{list.name}</h2>
                                        <div>
                                            <button onClick={() => {
                                                setEditingListId(list.id);
                                                setEditListIdInputValue(list.name);
                                            }}>
                                                <Pencil />
                                            </button>
                                            <Link to={`/custom-lists/${list.name}`}>
                                                <Expand />
                                            </Link>
                                            <button onClick={() => setListIdToDelete(list.id)}>
                                                <Trash />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className='list-info-and-edit-list-anime-btn-container'>
                                <div>
                                    <p>Created: {new Date(list.createdAt).toLocaleString()}</p>
                                    <p>{list.anime.length} Anime</p>
                                </div>
                                <div>
                                    <button
                                        className="edit-list-button"
                                        onClick={() =>
                                            setIsEditingAnimeInList(
                                                isEditingAnimeInList === list.id ? null : list.id
                                            )
                                        }
                                    >
                                        <SquarePen />
                                    </button>
                                </div>
                            </div>

                            <div
                                ref={(el) => (listRefs.current[list.id] = el)}
                                className="custom-list-anime-container"
                            >
                                {list.anime.length > 0 ? (
                                    list.anime.map((anime) => (
                                        <div key={anime.mal_id}>
                                            <AnimeCardForCustomListsPage
                                                isEditingAnimeInList={isEditingAnimeInList}
                                                setIsEditingAnimeInList={setIsEditingAnimeInList}
                                                listId={list.id}
                                                anime={anime}
                                                isFavorite={isFavorite}
                                                onFavoriteToggle={handleAddToFavorites}
                                                showAddButton={true}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p>No anime in this list</p>
                                )}
                            </div>
                        </div>

                    </React.Fragment>
                ))}
            </div>
        </>
    );
}

export default CustomListsPageLists;
