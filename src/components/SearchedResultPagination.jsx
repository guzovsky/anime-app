const SearchedResultPagination = ({ totalPages, currentPage, handleSearch, filters, isLoading }) => {
    return (
        <>
            {!isLoading && (
                <div className="pagination">
                    {currentPage > 1 && (
                        <button onClick={() => {
                            handleSearch(filters, currentPage - 1)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }}>Prev</button>
                    )}
                    <span>Page {currentPage} of {totalPages}</span>
                    {currentPage < totalPages && (
                        <button onClick={() => {
                            handleSearch(filters, currentPage + 1)
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}>Next</button>
                    )}
                </div>
            )}
        </>
    )
}

export default SearchedResultPagination