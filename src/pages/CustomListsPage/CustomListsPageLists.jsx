import { SquarePen, Trash, Expand, Pencil } from 'lucide-react';
import AnimeContext from "../../contexts/AnimeContext"
import { useContext, useState, useRef, useEffect } from "react"
import AnimeCardForCustomListsPage from './AnimeCardForCustomListsPage';
import DeletionConfirmationScreen from "./DeletionConfirmationScreen"
import React from 'react';
import { Link } from "react-router-dom";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    useSortable,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";

function SortableAnimeCard({ anime, listId, isEditingAnimeInList, activeId, ...props }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: anime.mal_id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isEditingAnimeInList === listId ? "grab" : "default",
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(isEditingAnimeInList === listId ? { ...attributes, ...listeners } : {})}
        >
            <AnimeCardForCustomListsPage
                anime={anime}
                listId={listId}
                isEditingAnimeInList={isEditingAnimeInList}
                {...props}
            />
        </div>
    );
}

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
        setCustomLists,
    } = useContext(AnimeContext);

    const [listIdToDelete, setListIdToDelete] = useState(null);
    const [editListIdInputValue, setEditListIdInputValue] = useState("");

    const [activeAnime, setActiveAnime] = useState(null);
    const [activeListId, setActiveListId] = useState(null);

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

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
    );

    const handleDragStart = (listId, event) => {
        const { active } = event;
        const draggedAnime = customLists
            .flatMap((l) => l.anime.map((a) => ({ ...a, listId: l.id })))
            .find((a) => a.mal_id === active.id);

        setActiveAnime(draggedAnime);
        setActiveListId(listId);
    };

    const handleDragEnd = (listId, event) => {
        const { active, over } = event;
        setActiveAnime(null);
        setActiveListId(null);

        if (!over) return;

        if (active.id !== over.id) {
            setCustomLists(prevLists =>
                prevLists.map(list => {
                    if (list.id === listId) {
                        const oldIndex = list.anime.findIndex(a => a.mal_id === active.id);
                        const newIndex = list.anime.findIndex(a => a.mal_id === over.id);
                        const newAnimeOrder = arrayMove(list.anime, oldIndex, newIndex);
                        return { ...list, anime: newAnimeOrder };
                    }
                    return list;
                })
            );
        }
    };

    return (
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
                                <form onSubmit={(e) => { e.preventDefault(); onSubmit(list.id); }}>
                                    <input
                                        maxLength={80}
                                        placeholder="Type the new name here..."
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
                                        <button onClick={() => { setEditingListId(list.id); setEditListIdInputValue(list.name); }}>
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

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={(event) => handleDragStart(list.id, event)}
                            onDragEnd={(event) => handleDragEnd(list.id, event)}
                        >
                            <SortableContext
                                items={list.anime.map(a => a.mal_id)}
                                strategy={horizontalListSortingStrategy}
                            >
                                <div
                                    ref={(el) => (listRefs.current[list.id] = el)}
                                    className="custom-list-anime-container"
                                >
                                    {list.anime.length > 0 ? (
                                        list.anime.map((anime) => (
                                            <SortableAnimeCard
                                                key={anime.mal_id}
                                                anime={anime}
                                                listId={list.id}
                                                isEditingAnimeInList={isEditingAnimeInList}
                                                activeId={activeAnime?.mal_id}
                                                setIsEditingAnimeInList={setIsEditingAnimeInList}
                                                isFavorite={isFavorite}
                                                onFavoriteToggle={handleAddToFavorites}
                                                showAddButton={true}
                                            />
                                        ))
                                    ) : (
                                        <p>No anime in this list</p>
                                    )}
                                </div>
                            </SortableContext>

                            {createPortal(
                                <DragOverlay>
                                    {activeAnime ? (
                                        <AnimeCardForCustomListsPage
                                            anime={activeAnime}
                                            listId={activeListId}
                                            isEditingAnimeInList={isEditingAnimeInList}
                                            isFavorite={isFavorite}
                                            onFavoriteToggle={handleAddToFavorites}
                                            showAddButton={true}
                                        />
                                    ) : null}
                                </DragOverlay>,
                                document.body
                            )}
                        </DndContext>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

export default CustomListsPageLists;
