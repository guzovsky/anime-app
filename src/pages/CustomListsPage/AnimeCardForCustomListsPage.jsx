import { useContext } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import { Link } from "react-router-dom";
import { HeartPlus, HeartMinus, ListPlus, ListCheck } from 'lucide-react';
import AddAnimeToListsButtonDropDown from "../../components/AddAnimeToListsButtonDropDown";

function AnimeCardForCustomListsPage({ anime, isFavorite, onFavoriteToggle, showAddButton = true, listId }) {
    const { setAnimeCardIsOpen, setAddAnimeToListsButtonDropDownIsOpen, isAddedToAList, } = useContext(AnimeContext);

    const isSaved = isAddedToAList(anime)

    return (
        <div className="custom-list-anime-container-anime-card">
            <Link
                to={`/anime/${anime.mal_id}`}
                className="custom-list-anime-container-anime-image"
                onClick={() => setAnimeCardIsOpen(anime.mal_id)}
            >
                <img src={anime.images.jpg.large_image_url} alt={anime.title} />
            </Link>

            <div className="custom-list-anime-container-anime-details">
                <h2 className="custom-list-anime-container-anime-title">{anime.title}</h2>

                <div className="custom-list-anime-container-favorite-btn-container">
                    {showAddButton ? (
                        !isFavorite(anime) ? (
                            <button onClick={() => onFavoriteToggle(anime)} className="custom-list-anime-container-add-btn">
                                <HeartPlus />
                            </button>
                        ) : (
                            <button onClick={() => onFavoriteToggle(anime)} className="custom-list-anime-container-remove-btn">
                                <HeartMinus />
                            </button>
                        )
                    ) : (
                        <button onClick={() => onFavoriteToggle(anime)} className="custom-list-anime-container-remove-btn">
                            <HeartMinus />
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setAddAnimeToListsButtonDropDownIsOpen(prev =>
                                prev.id === anime.mal_id && prev.type === 'custom' && prev.listId === listId
                                    ? { id: null, type: null }
                                    : { id: anime.mal_id, type: 'custom', listId: listId }
                            );
                        }}
                        className="custom-list-anime-container-add-to-lists-btn"
                    >
                        {isSaved ? <ListCheck size={29} /> : <ListPlus size={29} />}
                    </button>
                </div>
            </div>

            <AddAnimeToListsButtonDropDown anime={anime} listId={listId} />
        </div>

    );
}

export default AnimeCardForCustomListsPage;
