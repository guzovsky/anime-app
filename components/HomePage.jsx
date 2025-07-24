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

function HomePage({ onSearch, animeList, handleAddToFavorites, isFavorite }) {
    const [topAnime, setTopAnime] = useState([]);
    const [randomKey, setRandomKey] = useState(0);

    useEffect(() => {
        const fetchTopAnime = async () => {
            try {
                const response = await axios.get('https://api.jikan.moe/v4/top/anime?filter=airing');
                setTopAnime(response.data.data);
            } catch (error) {
                console.error('Error fetching top anime:', error);
            }
        };

        fetchTopAnime();
    }, [randomKey]);

    const displayedAnime = removeDuplicates(animeList.length > 0 ? animeList : topAnime);

    return (
        <div className="container">
            <h1>Explore and Save Your Favorite Anime</h1>
            <SearchBar onSearch={onSearch} />

            <ResultsHeader
                animeList={animeList}
                setRandomKey={setRandomKey}
            />

            <Results
                displayedAnime={displayedAnime}
                isFavorite={isFavorite}
                handleAddToFavorites={handleAddToFavorites}
            />

        </div>
    );
}

export default HomePage;
