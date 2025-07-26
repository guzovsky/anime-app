import SearchBar from "./SearchBar";
import '../css/home.css';
import axios from "axios";
import { useEffect, useState } from "react";
import ResultsHeader from "./ResultsHeader";
import Results from "./Results";

function removeDuplicates(animeArray) {
    const seen = new Set();
    return animeArray.filter(anime => {
        if (seen.has(anime.mal_id)) return false;
        seen.add(anime.mal_id);
        return true;
    });
}

function HomePage({ topAnime, isLoading, onSearch, animeList, handleAddToFavorites, isFavorite }) {


    const displayedAnime = removeDuplicates(animeList.length > 0 ? animeList : topAnime);

    return (
        <div className="container">
            <h1>Explore and Save Your Favorite Anime</h1>
            <SearchBar onSearch={onSearch} />

            <ResultsHeader
                animeList={animeList}
            />

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <Results
                    displayedAnime={displayedAnime}
                    handleAddToFavorites={handleAddToFavorites}
                    isFavorite={isFavorite}
                />
            )}

        </div>
    );
}

export default HomePage;
