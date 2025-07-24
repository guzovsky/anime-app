import { RotateCcw } from 'lucide-react';

function ResultsHeader({ animeList, setRandomKey }) {
    
    return (
        <div className="results-header">
            <h2>{animeList.length > 0 ? "Search Results" : "Top Airing Anime"}</h2>
            {animeList.length === 0 && (
                <button className="update-btn" onClick={() => setRandomKey(prev => prev + 1)}>
                    <RotateCcw />
                </button>
            )}
        </div>
    )
}

export default ResultsHeader;