import { useParams } from "react-router-dom";
import { useContext, useState, useEffect, useMemo } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import AnimeCard from "../../components/AnimeCard";
import FiltersForSeeMorePage from "./FiltersForSeeMorePage";
import "../../styles/seeMorePage.css"
import Pagination from "../../components/Pagination";
import HentaiFilter from "../../components/HentaiFilter/HentaiFilter";

const SeeMorePage = () => {
    const { categoryType } = useParams()
    const [isResettingFilters, setIsResettingFilters] = useState(false);
    const [filterHentai, setFilterHentai] = useState(true)
    const [rawAnimeList, setRawAnimeList] = useState([]);

    const {
        isFavorite,
        handleAddToFavorites,
        isLoading,
        genreForSeeMorePage,
        setGenreForSeeMorePage,
        setSeeMorePageIsOpen,
        sideBarAnimepage,
        setSideBarAnimepage,

    } = useContext(AnimeContext);

    useEffect(() => {
        setSeeMorePageIsOpen(categoryType);
    }, [categoryType]);

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
                return {
                    title: "Most Popular Anime",
                    status: "",
                    orderBy: "popularity",
                    sort: "asc",
                };
            case "airing":
            default:
                return {
                    title: "Top Airing Anime",
                    status: "airing",
                    orderBy: "score",
                    sort: "desc",
                };
        }
    }, [categoryType]);



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
            <HentaiFilter filterHentai={filterHentai} setFilterHentai={setFilterHentai} />

            {!isResettingFilters && (
                <FiltersForSeeMorePage
                    genre={genreForSeeMorePage}
                    setGenre={setGenreForSeeMorePage}
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
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                filterHentai={filterHentai}
                setFilterHentai={setFilterHentai}
                setRawAnimeList={setRawAnimeList}
                rawAnimeList={rawAnimeList}
                animeList={animeList}
                genre={genreForSeeMorePage}
                status={status}
                orderBy={orderBy}
                sort={sort}
                setAnimeList={setAnimeList}
                page={sideBarAnimepage}
                setPage={setSideBarAnimepage}
                isResettingFilters={isResettingFilters}
            />

        </div>

    )
}

export default SeeMorePage;
