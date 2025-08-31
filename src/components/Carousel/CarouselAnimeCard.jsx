import { Link } from "react-router-dom";
import "./carousel.css";
import { useContext } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import { HeartPlus, HeartMinus, ListPlus, ListCheck } from 'lucide-react';
import AddAnimeToListsButtonDropDown from "../AddAnimeToListsButtonDropDown";

function CarouselAnimeCard({ anime, isFavorite, onFavoriteToggle, id }) {

    const {
        setAnimeCardIsOpen,
        setAddAnimeToListsButtonDropDownIsOpen,
        isAddedToAList
    } = useContext(AnimeContext)

    const isSaved = isAddedToAList(anime)

    const status = anime.status

    return (
        <div className="carousel-anime-card">
            <Link
                to={`/anime/${id}`}
                className="carousel-anime-image"
                onClick={() => setAnimeCardIsOpen(id)}
            >
                <img src={anime.images.jpg.large_image_url} alt={anime.title} />
                <div className={`carousel-status-badge ${status === "Not yet aired" ? "red" : status === "Finished Airing" ? "gray" : ""}`}>{anime.status}</div>
            </Link>

            <div className="carousel-anime-details">
                <h2 className="carousel-anime-title">{anime.title}</h2>

                <p className="carousel-info-line">
                    <span>{anime.season ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1) : 'Unknown'} {anime.year || ''}</span>
                    <span>・{anime.episodes || 'Unknown'} episodes</span>
                </p>

                <div className="carousel-score-and-genre-tags-container">
                    <p className="carousel-score">⭐ {anime.score || 'N/A'}</p>

                    <div className="carousel-genre-tags">
                        {anime.genres.slice(0, 4).map((genre) => (
                            <span key={genre.mal_id} className="carousel-genre-pill">
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="carousel-favorite-btn-container">
                    {!isFavorite(anime) ? (
                        <button onClick={() => onFavoriteToggle(anime)} className="carousel-add-btn"><HeartPlus /></button>
                    ) : (
                        <button onClick={() => onFavoriteToggle(anime)} className="carousel-remove-btn"><HeartMinus /></button>
                    )}
                    <button
                        onClick={() => {
                            setAddAnimeToListsButtonDropDownIsOpen(prev =>
                                prev.id === id && prev.type === 'home'
                                    ? { id: null, type: null }
                                    : { id: id, type: 'home' }
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

export default CarouselAnimeCard;
