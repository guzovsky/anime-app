import { useContext } from "react";
import AnimeContext from "../contexts/AnimeContext";

function ResultsHeader() {
    const { isLoading, animeList } = useContext(AnimeContext);

    const headerText = isLoading
        ? "Loading..."
        : animeList.length > 0
            ? "Search Results"
            : "Top Airing Anime";

    return (
        <>
            <div className="results-header">
                <h2>{headerText}</h2>
            </div>
        </>
    );
}

export default ResultsHeader;