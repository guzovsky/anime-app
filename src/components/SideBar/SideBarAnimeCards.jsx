import { useContext } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import { Link } from "react-router-dom";
import { HeartPlus, HeartMinus, ListCheck, ListPlus } from 'lucide-react';
import AddAnimeToListsButtonDropDown from "../AddAnimeToListsButtonDropDown";

function SideBarAnimeCards({ anime, setIsSidebarOpen, isFavorite, onFavoriteToggle, showAddButton = true }) {
    const { setAnimeCardIsOpen, setAddAnimeToListsButtonDropDownIsOpen, isAddedToAList, setCustomLists } = useContext(AnimeContext);

    const isSaved = isAddedToAList(anime)

    return (
        <div className="sidebar-anime-card">
            <Link to={`/anime/${anime.mal_id}`} className="sidebar-anime-image" onClick={() => {
                setAnimeCardIsOpen(anime.mal_id)
                setIsSidebarOpen(false)
            }}>
                <img src={anime.images.jpg.image_url} alt={anime.title} />
            </Link>

            <div className="sidebar-anime-details">
                <h2 className="sidebar-anime-title">{anime.title}</h2>

                <div className="sidebar-anime-btn-container">
                    
                    {showAddButton ? (
                        !isFavorite(anime) ? (
                            <button onClick={() => onFavoriteToggle(anime)} className="sidebar-add-btn"><HeartPlus size="21" /></button>
                        ) : (
                            <button onClick={() => onFavoriteToggle(anime)} className="sidebar-remove-btn"><HeartMinus size="21" /></button>
                        )
                    ) : (
                        <button onClick={() => onFavoriteToggle(anime)} className="sidebar-remove-btn"><HeartMinus size="21" /></button>
                    )}

                    <button
                        onClick={() => {
                            setAddAnimeToListsButtonDropDownIsOpen(prev =>
                                prev.id === anime.mal_id && prev.type === 'home'
                                    ? { id: null, type: null }
                                    : { id: anime.mal_id, type: 'home' }
                            );
                        }}
                        className="add-to-lists-btn"
                    >
                        {isSaved ? <ListCheck size={29} /> : <ListPlus size={29} />}
                    </button>

                </div>



            </div>

            <AddAnimeToListsButtonDropDown anime={anime} />

        </div>
    );
}

export default SideBarAnimeCards;
