function ResultsHeader({ animeList }) {
    
    return (
        <div className="results-header">
            <h2>{animeList.length > 0 ? "Search Results" : "Top Airing Anime"}</h2>
        </div>
    )
}

export default ResultsHeader;