import { useContext } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import { Link } from "react-router-dom";

function SideBarAnimeCards({ anime, setIsSidebarOpen, isFavorite, onFavoriteToggle, showAddButton = true }) {
    const { setAnimeCardIsOpen } = useContext(AnimeContext);

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

                <div className="sidebar-favorite-btn-container">
                    {showAddButton ? (
                        !isFavorite(anime) ? (
                            <button onClick={() => onFavoriteToggle(anime)} className="sidebar-add-btn">Add to Favorites</button>
                        ) : (
                            <button onClick={() => onFavoriteToggle(anime)} className="sidebar-remove-btn">Remove from Favorites</button>
                        )
                    ) : (
                        <button onClick={() => onFavoriteToggle(anime)} className="sidebar-remove-btn">Remove from Favorites</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SideBarAnimeCards;
