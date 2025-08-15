import { SquarePen, Trash } from 'lucide-react';
import AnimeCard from "../../components/AnimeCard";
import AnimeContext from "../../contexts/AnimeContext"
import { useContext, useState } from "react"
import AnimeCardForCustomListsPage from './AnimeCardForCustomListsPage';

function CustomListsPageLists() {
    const {
        customLists,
        setCustomLists,
        editingListId,
        setEditingListId,
        deleteCustomList,
        isFavorite,
        handleAddToFavorites,
        editListName,
    } = useContext(AnimeContext);

    const [editListIdInputValue, setEditListIdInputValue] = useState("")

    const handleChange = (e) => {
        setEditListIdInputValue(e.target.value);
    };

    const onSubmit = (listId) => {
        editListName(editListIdInputValue, listId)
        setEditListIdInputValue("")
        setEditingListId(null)
    };

    return (
        <div className="custom-list-container">
            {customLists.map((list, index) => (
                <div key={list.id} className="custom-list">
                    <div className="custom-list-title-container">
                        {editingListId === list.id ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onSubmit(list.id)
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
                                        <SquarePen />
                                    </button>
                                    <button onClick={() => deleteCustomList(list.id)}>
                                        <Trash />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <p>Created: {new Date(list.createdAt).toLocaleString()}</p>
                    <p>{list.anime.length} Anime</p>

                    <div className="custom-list-anime-container">
                        {list.anime.length > 0 ? (

                            list.anime.map((anime) => (
                                <div key={anime.mal_id}>
                                    <AnimeCardForCustomListsPage
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
            ))}
        </div>
    );

}

export default CustomListsPageLists