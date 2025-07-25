import { Link } from "react-router-dom";

function AnimeCard({ anime, isFavorite, onFavoriteToggle, showAddButton = true }) {
    return (
        <div className="anime-card">
            <Link to={`/anime/${anime.mal_id}`} className="anime-image">
                <img src={anime.images.jpg.image_url} alt={anime.title} />
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
                            <button onClick={() => onFavoriteToggle(anime)} className="add-btn">Add to Favorites</button>
                        ) : (
                            <button onClick={() => onFavoriteToggle(anime)} className="remove-btn">Remove from Favorites</button>
                        )
                    ) : (
                        <button onClick={() => onFavoriteToggle(anime)} className="remove-btn">Remove from Favorites</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnimeCard;
