import { CircleX } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnimeContext from "../../contexts/AnimeContext";
import AnimeCard from "../../components/AnimeCard";

function FullScreenList() {

    const { listName } = useParams();
    const { customLists, isFavorite, handleAddToFavorites } = useContext(AnimeContext);
    const navigate = useNavigate();

    const list = customLists.find(l => l.name === listName);
    const animeList = list.anime

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


    if (!list) return <p>List not found</p>;

    return (

        <div className="full-screen-list-container">
            <div className="close-full-screen-list">
                <button onClick={() => navigate(-1)}><CircleX /></button>
            </div>

            <div className="header-container">
                <h1>{list.name}</h1>

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
            </div>
        </div>

    )
}

export default FullScreenList