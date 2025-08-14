import { useContext } from "react";
import AnimeContext from "../contexts/AnimeContext";
import { Link } from "react-router-dom";
import { HeartPlus, HeartMinus, ListPlus, ListCheck } from 'lucide-react';
import AddAnimeToListsButtonDropDown from "./AddAnimeToListsButtonDropDown";

function AnimeCard({ anime, isFavorite, onFavoriteToggle, showAddButton = true }) {
    const { setAnimeCardIsOpen, addAnimeToListsButtonDropDownIsOpen, setAddAnimeToListsButtonDropDownIsOpen, isAddedToAList, } = useContext(AnimeContext);

    const isSaved = isAddedToAList(anime)

    return (
        <div className="anime-card">
            <Link to={`/anime/${anime.mal_id}`} className="anime-image" onClick={() => setAnimeCardIsOpen(anime.mal_id)}>
                <img src={anime.images.jpg.large_image_url} alt={anime.title} />
                <div className="status-badge">{anime.status}</div>
                <div className="info-line mobile-info-line">
                    <p>{anime.season ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1) : 'Unknown'} {anime.year || ''}</p>
                    <p>{anime.episodes || 'Unknown'} episodes</p>
                </div>
            </Link>

            <div className="anime-details">
                <h2 className="anime-title">{anime.title}</h2>

                <p className="info-line">
                    <span>{anime.season ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1) : 'Unknown'} {anime.year || ''}</span>
                    <span>・{anime.episodes || 'Unknown'} episodes</span>
                </p>

                <div className="score-and-genre-tags-container">
                    <p className="score">⭐ {anime.score || 'N/A'}</p>

                    <div className="genre-tags">
                        {anime.genres.slice(0, 4).map((genre) => (
                            <span key={genre.mal_id} className="genre-pill">
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="favorite-btn-container">
                    {showAddButton ? (
                        !isFavorite(anime) ? (
                            <button onClick={() => onFavoriteToggle(anime)} className="add-btn"><HeartPlus /></button>
                        ) : (
                            <button onClick={() => onFavoriteToggle(anime)} className="remove-btn"><HeartMinus /></button>
                        )
                    ) : (
                        <button onClick={() => onFavoriteToggle(anime)} className="remove-btn"><HeartMinus /></button>
                    )}
                    <button
                        onClick={() =>
                            setAddAnimeToListsButtonDropDownIsOpen(prev =>
                                prev === anime.mal_id ? null : anime.mal_id
                            )
                        }
                        className="add-to-lists-btn"
                    >
                        {isSaved ? (
                            <ListCheck size={29} />
                        ) : (
                            <ListPlus size={29} />
                        )}
                        
                    </button>
                </div>
            </div>


            <AddAnimeToListsButtonDropDown anime={anime} />

        </div>
    );
}

export default AnimeCard;
