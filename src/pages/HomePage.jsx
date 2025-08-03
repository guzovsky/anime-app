import { useContext, useEffect, useState } from "react";
import FiltersSection from "../components/FiltersSection";
import AnimeContext from "../contexts/AnimeContext";
import SearchBar from "../components/SearchBar";
import ResultsHeader from "../components/ResultsHeader";
import Results from "../components/Results";
import '../styles/general.css';
import SearchedResultPagination from "../components/SearchedResultPagination";


function HomePage() {
    const {
        setAnimeCardIsOpen,
        isLoading,
        handleSearch,
        animeList,
        filters,
        setFilters,
        hasSearched,
        currentPage,
        totalPages,
        setTopAnimePage,
    } = useContext(AnimeContext)

    useEffect(() => {
        setAnimeCardIsOpen(null);
    }, []);

    return (
        <div className="container">
            <h1>Explore and Save Your Favorite Anime</h1>
            <SearchBar filters={filters} setFilters={setFilters} onSearch={() => handleSearch(filters)} />

            <ResultsHeader animeList={animeList} />
            <FiltersSection onSearch={() => handleSearch(filters)} />

            {isLoading ? (
                <p>Loading...</p>
            ) : animeList.length === 0 && hasSearched ? (
                <p className="no-results-message">No results found. Try adjusting your filters or search.</p>
            ) : (
                <Results />
            )}

            {hasSearched ? (
                <SearchedResultPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleSearch={handleSearch}
                    filters={filters}
                    isLoading={isLoading}
                />
            ) : isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="load-more-airing-anime">
                    <button
                        className="load-more-airing-anime-btn"
                        onClick={() => setTopAnimePage(prev => prev + 1)}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}

export default HomePage;
