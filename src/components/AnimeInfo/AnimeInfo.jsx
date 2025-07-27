export function AnimeInfo({ anime, title, info }) {
    return (
        <div>
            <h3>{title}:</h3>
            <p>{anime[info] || "N/A"}</p>
        </div>
    );
};