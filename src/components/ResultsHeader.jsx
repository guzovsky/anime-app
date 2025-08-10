import { useContext } from "react";
import AnimeContext from "../contexts/AnimeContext";

function ResultsHeader() {
    const { isLoading, animeList, hasSearched, } = useContext(AnimeContext);

    const headerText = isLoading ? "Loading..."
        : hasSearched ? "Search Results" : ""

    return (
        <>
            <div className="results-header">
                <h2>{headerText}</h2>
            </div>
        </>
    );
}

export default ResultsHeader;