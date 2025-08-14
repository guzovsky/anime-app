import { SquarePen, Trash } from 'lucide-react';
import AnimeCard from "../../components/AnimeCard";
import AnimeContext from "../../contexts/AnimeContext"
import { useContext } from "react"
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
    } = useContext(AnimeContext);

    return (
        <div className="custom-list-container">
            {customLists.map((list, index) => (
                <div key={index} className="custom-list">
                    <div className="custom-list-title-container">
                        {editingListId === index ? (
                            <input
                                type="text"
                                value={list.name}
                                onChange={(e) => {
                                    const newLists = [...customLists];
                                    newLists[index].name = e.target.value;
                                    setCustomLists(newLists);
                                }}
                                onBlur={() => setEditingListId(null)}
                                autoFocus
                            />
                        ) : (
                            <>
                                <h2>{list.name}</h2>
                                <div>
                                    <button onClick={() => setEditingListId(index)}>
                                        <SquarePen />
                                    </button>
                                    <button onClick={() => deleteCustomList(index)}>
                                        <Trash />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <p>{list.anime.length} Anime</p>

                    <div className="custom-list-anime-container">
                        {list.anime.length > 0 ? (

                            list.anime.map((anime) => (
                                <div key={anime.mal_id}>
                                    <AnimeCardForCustomListsPage
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