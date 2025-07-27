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