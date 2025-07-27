export function RelationsList({ anime }) {
    if (!anime.relations || anime.relations.length === 0) {
        return null;
    }

    return (
        <div>
            <h2>Relations:</h2>
            {anime.relations.map((relation, index) => (
                <div key={`${relation.relation}-${index}`}>
                    <h3>{relation.relation || "N/A"}:</h3>
                    {relation.entry.map((entry) => (
                        <div key={entry.mal_id}>
                            <p><strong>Type: </strong>{entry.type ? entry.type.charAt(0).toUpperCase() + entry.type.slice(1) : "N/A"}</p>
                            <p>
                                <strong>Name: </strong>
                                <a href={entry.url} target="_blank" rel="noopener noreferrer">
                                    {entry.name || "N/A"}
                                </a>
                            </p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}