import { useContext } from "react";
import FiltersSection from "../components/FiltersSection";
import AnimeContext from "../contexts/AnimeContext";
import SearchBar from "../components/SearchBar";
import ResultsHeader from "../components/ResultsHeader";
import Results from "../components/Results";
import '../styles/general.css';
import SearchedResultPagination from "../components/SearchedResultPagination";
import Carousel from "../components/Carousel/Carousel";


function HomePage() {
    const {
        isLoading,
        handleSearch,
        animeList,
        filters,
        setFilters,
        hasSearched,
        currentPage,
        totalPages,
        topAnime,
        fetchTopAnime,
        topAnimeFailed,
        topAnimeIsLoading,
        mostPopularAnime,
        topUpcomingAnime,
        sideBarAnimeIsLoading,
        sidebarDataFailed,
        fetchSidebarAnime,
    } = useContext(AnimeContext)

    return (
        <div className="container">
            <h1>Explore and Save Your Favorite Anime</h1>
            <SearchBar filters={filters} setFilters={setFilters} onSearch={() => handleSearch(filters)} />

            <ResultsHeader animeList={animeList} />
            <FiltersSection onSearch={() => handleSearch(filters)} />

            {!hasSearched && (
                <>
                    <Carousel header="Top Airing Anime" animeList={topAnime} animeListFailed={topAnimeFailed} fetchFunction={fetchTopAnime} animeIsLoading={topAnimeIsLoading} statusFilter="airing" />
                    <Carousel header="Top Upcoming Anime" animeList={topUpcomingAnime} animeListFailed={sidebarDataFailed} fetchFunction={fetchSidebarAnime} animeIsLoading={sideBarAnimeIsLoading} statusFilter="upcoming" />
                    <Carousel header="Most Popular Anime" animeList={mostPopularAnime} animeListFailed={sidebarDataFailed} fetchFunction={fetchSidebarAnime} animeIsLoading={sideBarAnimeIsLoading} statusFilter="popular" />
                </>
            )}

            {isLoading ? (
                <p>Loading...</p>
            ) : hasSearched && (
                animeList.length === 0 ? (
                    <p className="no-results-message">No results found. Try adjusting your filters or search.</p>
                ) : (
                    <Results />
                )
            )}

            {hasSearched && (
                <SearchedResultPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleSearch={handleSearch}
                    filters={filters}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}

export default HomePage;
