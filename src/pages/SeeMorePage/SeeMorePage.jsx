import { useParams } from "react-router-dom";
import { useContext, useState, useEffect, useMemo } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import AnimeCard from "../../components/AnimeCard";
import FiltersForSeeMorePage from "./FiltersForSeeMorePage";
import "../../styles/seeMorePage.css"
import Pagination from "../../components/Pagination";

const SeeMorePage = () => {
    const [genre, setGenre] = useState("");
    const { categoryType } = useParams()
    const [page, setPage] = useState(1);
    const [isResettingFilters, setIsResettingFilters] = useState(false);

    const {
        isFavorite,
        handleAddToFavorites,
        isLoading,
    } = useContext(AnimeContext);

    const [animeList, setAnimeList] = useState([]);

    const { title, status, orderBy, sort } = useMemo(() => {
        switch (categoryType) {
            case "upcoming":
                return {
                    title: "Top Upcoming Anime",
                    status: "upcoming",
                    orderBy: "popularity",
                    sort: "asc",
                };
            case "popular":
            default:
                return {
                    title: "Most Popular Anime",
                    status: "",
                    orderBy: "popularity",
                    sort: "asc",
                };
        }
    }, [categoryType]);

    useEffect(() => {
        setIsResettingFilters(true);
        setGenre("");
        setPage(1);
        setAnimeList([]);

        const timeout = setTimeout(() => {
            setIsResettingFilters(false);
        }, 0);

        return () => clearTimeout(timeout);
    }, [categoryType]);


    useEffect(() => {
        setPage(1);
    }, [genre]);



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

            {!isResettingFilters && (
                <FiltersForSeeMorePage
                    genre={genre}
                    setGenre={setGenre}
                />
            )}

            {isLoading ? (
                <p>Loading...</p>
            ) : (
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
            )}
            


            <Pagination
                animeList={animeList}
                genre={genre}
                status={status}
                orderBy={orderBy}
                sort={sort}
                setAnimeList={setAnimeList}
                page={page}
                setPage={setPage}
            />

        </div>

    )
}

export default SeeMorePage;
