import { useContext, useEffect, useState } from "react";
import FiltersSection from "../components/FiltersSection";
import AnimeContext from "../contexts/AnimeContext";
import SearchBar from "../components/SearchBar";
import ResultsHeader from "../components/ResultsHeader";
import Results from "../components/Results";
import '../styles/general.css';
import Pagination from "../components/Pagination";


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

            <Pagination currentPage = {currentPage} totalPages={totalPages} handleSearch={handleSearch} filters={filters}/>
        </div>
    );
}

export default HomePage;
