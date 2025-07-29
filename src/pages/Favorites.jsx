import { useEffect, useContext, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import AnimeContext from "../contexts/AnimeContext";

function getColumnCount() {
  if (window.innerWidth < 600) return 2;
  return 3;
}

function FavoritesPage() {

  const {
    topAnime,
    handleAddToFavorites,
    isFavorite,
    favorites,
    removeDuplicates,
  } = useContext(AnimeContext)

  const [columnsCount, setColumnsCount] = useState(getColumnCount());

  useEffect(() => {
    const handleResize = () => {
      setColumnsCount(getColumnCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = Array.from({ length: columnsCount }, () => []);
  const columns2 = Array.from({ length: columnsCount }, () => []);

  favorites.forEach((anime, index) => {
    columns[index % columnsCount].push(anime);
  });

  removeDuplicates(topAnime).forEach((anime, index) => {
    columns2[index % columnsCount].push(anime);
  });

  return (
    <div className="container">
      {favorites.length === 0 ? (
        <>
          <h1>You don't have any favorite anime yet. Try adding some!</h1>
          <h2 className="recommendations-title">Here are some recommendations:</h2>
          <div className="masonry-container">
            {columns2.map((column, colIndex) => (
              <div key={colIndex} className="masonry-column">
                {column.map((anime) => (
                  <AnimeCard
                    key={anime.mal_id}
                    anime={anime}
                    isFavorite={isFavorite}
                    onFavoriteToggle={handleAddToFavorites}
                    showAddButton={true}
                  />
                ))}
              </div>
            ))}
          </div>
        </>

      ) : (
        <>
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
        </>
      )}

    </div>
  );
}

export default FavoritesPage;
