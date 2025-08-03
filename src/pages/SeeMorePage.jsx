import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AnimeContext from "../contexts/AnimeContext";
import AnimeCard from "../components/AnimeCard";
import FiltersSection from "../components/FiltersSection";
import "../styles/seeMorePage.css"
import Pagination from "../components/Pagination";

const SeeMorePage = () => {
    const { categoryType } = useParams()
    const {
        isFavorite,
        handleAddToFavorites,
    } = useContext(AnimeContext);

    const [animeList, setAnimeList] = useState([]);

    let title = ""
    let status = ""
    let orderBy = ""
    let sort = ""

        switch (categoryType) {
            case "upcoming":
                title = "Top Upcoming Anime";
                status = "upcoming";
                orderBy = "popularity";
                sort = "asc";
                break;
            case "popular":
                title = "Most Popular Anime";
                orderBy = "popularity";
                sort = "asc";
                break;
            default:
                break;
        }


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

        <div className="see-more-page">
            <h1>{title}</h1>

            <FiltersSection />

            <div className="masonry-container">
                {columns.map((column, colIndex) => (
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


            <Pagination
                status={status}
                orderBy={orderBy}
                sort={sort}
                setAnimeList={setAnimeList}
            />

        </div>

    )
}

export default SeeMorePage;
