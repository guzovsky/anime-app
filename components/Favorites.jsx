import AnimeCard from "./AnimeCard";

function FavoritesPage({ favorites, handleAddToFavorites, isFavorite }) {
  return (
    <div className="container">
      <div className="results">
        {favorites.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            anime={anime}
            isFavorite={isFavorite}
            onFavoriteToggle={handleAddToFavorites}
            showAddButton={false}
          />
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
