export function AnimeInfo({ anime, title, info }) {
  return (
    <div>
      <h3>{title}:</h3>
      <p>{anime[info] || "N/A"}</p>
    </div>
  );
};

export function InfoList({ title, items }) {
  return (
    <div>
      <h3>{title}:</h3>
      <p>
        {items.length > 0 ? (
          items.map((item, index) => (
            <span key={`${item.mal_id}-${index}`}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.name}
              </a>
              {index < items.length - 1 && ', '}
            </span>
          ))
        ) : (
          'N/A'
        )}
      </p>
    </div>
  )
}


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


export function FormatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/\//g, '-');
}



export function RemoveAutoPlay(url) {
  if (!url) return '';
  const cleanUrl = new URL(url);
  cleanUrl.searchParams.delete('autoplay'); // remove autoplay param
  return cleanUrl.toString();
}