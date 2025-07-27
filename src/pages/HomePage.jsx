import { useContext, useEffect } from "react";
import AnimeContext from "../contexts/AnimeContext";
import SearchBar from "../components/SearchBar";
import ResultsHeader from "../components/ResultsHeader";
import Results from "../components/Results";
import '../styles/home.css';


function HomePage() {

    const {
        setAnimeCardIsOpen,
        isLoading,
        handleSearch,
        animeList,
    } = useContext(AnimeContext)

    useEffect(() => {
        setAnimeCardIsOpen(null);
    }, []);

    return (
        <div className="container">
            <h1>Explore and Save Your Favorite Anime</h1>
            <SearchBar onSearch={handleSearch} />

            <ResultsHeader animeList={animeList} />

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <Results />
            )}
        </div>
    );
}

export default HomePage;
