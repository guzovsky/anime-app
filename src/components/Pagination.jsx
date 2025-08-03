import { useContext, useState, useEffect } from "react";
import AnimeContext from "../contexts/AnimeContext";
import axios from "axios";

function Pagination({ status, orderBy, sort, setAnimeList }) {

    const {
        setIsLoading,
        isLoading,
        removeDuplicates,
    } = useContext(AnimeContext);

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchAnime = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("https://api.jikan.moe/v4/anime", {
                params: {
                    ...(status && { status }),
                    ...(orderBy && { order_by: orderBy }),
                    ...(sort && { sort }),
                    page,
                },
            })

            const newAnimeList = removeDuplicates(response.data.data || []);
            setAnimeList(newAnimeList);
            setTotalPages(response.data.pagination.last_visible_page);


        } catch (err) {
            console.error("Error loading pages:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [status, orderBy, sort]);

    useEffect(() => {
        fetchAnime();
    }, [page, status, orderBy, sort]);

    return (
        <>
            {!isLoading && (
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
            )}
        </>
    );

}

export default Pagination