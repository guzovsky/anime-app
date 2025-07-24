import AnimeCard from "./AnimeCard";

function Results({ displayedAnime, isFavorite, handleAddToFavorites }) {
  return (
    <div className="results">
      {displayedAnime.map((anime) => (
        <AnimeCard
          key={anime.mal_id}
          anime={anime}
          isFavorite={isFavorite}
          onFavoriteToggle={handleAddToFavorites}
          showAddButton={true}
        />
      ))}
    </div>
  );
}

export default Results;
