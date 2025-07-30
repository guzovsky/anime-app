import '../styles/searchBar.css';

function SearchBar({ filters, setFilters, onSearch }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!filters.query.trim()) return
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            />
            <button type="submit" className='search-btn'>Search</button>
        </form>
    );
}


export default SearchBar;
