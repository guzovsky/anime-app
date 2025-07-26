import { useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";

function FavoritesPage({ favorites, handleAddToFavorites, isFavorite }) {
  const [columnsCount, setColumnsCount] = useState(getColumnCount());

  function getColumnCount() {
    if (window.innerWidth < 600) return 2;
    return 3;
  }

  useEffect(() => {
    const handleResize = () => {
      setColumnsCount(getColumnCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = Array.from({ length: columnsCount }, () => []);

  favorites.forEach((anime, index) => {
    columns[index % columnsCount].push(anime);
  });

  return (
    <div className="container">
      <h1>Your Favorite Anime</h1>
      <div className="masonry-container">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="masonry-column">
            {column.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                isFavorite={isFavorite}
                onFavoriteToggle={handleAddToFavorites}
                showAddButton={false}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
