import { useContext, useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";
import AnimeContext from "../contexts/AnimeContext";

function Results() {

  const {
    animeList,
    handleAddToFavorites,
    isFavorite,
  } = useContext(AnimeContext)

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

  animeList.forEach((anime, index) => {
    columns[index % columnsCount].push(anime);
  });

  return (
    <div className="masonry-container">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="masonry-column">
          {column.map((anime) => (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              isFavorite={isFavorite}
              onFavoriteToggle={handleAddToFavorites}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Results;
