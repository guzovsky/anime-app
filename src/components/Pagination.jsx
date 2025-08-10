import { useContext, useState, useEffect } from "react";
import AnimeContext from "../contexts/AnimeContext";
import axios from "axios";

function Pagination({ status, orderBy, sort, setAnimeList, genre, page, setPage, animeList, isResettingFilters }) {

    const {
        setIsLoading,
        isLoading,
        removeDuplicates,
        removeBuggedAnime,
        sidebarAnimeCache,
        setSidebarAnimeCache,
        sideBarAnimePageCache,
        setSideBarAnimePageCache,
    } = useContext(AnimeContext);

    useEffect(() => {
        setSideBarAnimePageCache(page)
    }, [page]);

    const [totalPages, setTotalPages] = useState(1)

    const fetchAnime = async () => {

        const cacheKey = `${status}-${genre}-${orderBy}-${sort}-${page}`;

        if (sidebarAnimeCache[cacheKey]) {
            setAnimeList(sidebarAnimeCache[cacheKey].anime);
            setPage(sidebarAnimeCache[cacheKey].currentPage);
            setTotalPages(sidebarAnimeCache[cacheKey].totalPages);
            return;
        }

        setIsLoading(true);

        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (genre) params.append("genres", genre);
        if (orderBy) {
            params.append("order_by", orderBy);
            params.append("sort", sort);
        }
        params.append("page", page);
        params.append("limit", 21);

        try {
            const response = await axios.get(`https://api.jikan.moe/v4/anime?${params.toString()}`);
            let newAnimeList = removeDuplicates(removeBuggedAnime(response.data.data) || []);

            setAnimeList(newAnimeList);
            setTotalPages(response.data.pagination.last_visible_page);

            setSidebarAnimeCache(prev => ({
                ...prev,
                [cacheKey]: {
                    anime: newAnimeList,
                    currentPage: response.data.pagination.current_page,
                    totalPages: response.data.pagination.last_visible_page
                }
            }));

        } catch (err) {
            console.error("Error loading pages:", err);
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        if (!isResettingFilters) {
            fetchAnime();
        }
    }, [page, status, orderBy, sort, genre, isResettingFilters]);

    return (
        <>
            {!isLoading && (
                animeList.length === 0 ? (
                    <p className="no-results-message">No results found. Try adjusting your filters or search.</p>
                ) : (
                    <div className="pagination">
                        {page > 1 && (
                            <button
                                onClick={() => {
                                    setPage((prev) => prev - 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                Prev
                            </button>
                        )}
                        <span>Page {page} of {totalPages}</span>
                        {page < totalPages && (
                            <button
                                onClick={() => {
                                    setPage((prev) => prev + 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                Next
                            </button>
                        )}
                    </div>
                )
            )}
        </>
    );

}

export default Pagination