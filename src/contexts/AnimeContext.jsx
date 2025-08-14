import { createContext, useState, useRef, useEffect } from "react";
import axios from "axios";


const AnimeContext = createContext();



function removeDuplicates(animeArray) {
    const seen = new Set();
    return animeArray.filter(anime => {
        if (seen.has(anime.mal_id)) return false;
        seen.add(anime.mal_id);
        return true;
    });
}

const removeBuggedAnime = (animeList) => {
    return animeList.filter(anime =>
        anime.members > 100
    );
};


function sortAlphabetically(animeList, direction = "asc") {
    return [...animeList].sort((a, b) => {
        return direction === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
    });
}





export function AnimeProvider({ children }) {
    const [animeCardIsOpen, setAnimeCardIsOpen] = useState(null);
    const [seeMorePageIsOpen, setSeeMorePageIsOpen] = useState(null)
    const [editingListId, setEditingListId] = useState(null)
    const [addAnimeToListsButtonDropDownIsOpen, setAddAnimeToListsButtonDropDownIsOpen] = useState(null)

    const [animeList, setAnimeList] = useState([]);
    const [topAnime, setTopAnime] = useState([]);
    const [topUpcomingAnime, setTopUpcomingAnime] = useState([])
    const [mostPopularAnime, setMostPopularAnime] = useState([])
    const [animeGenres, setAnimeGenres] = useState([]);
    const [customLists, setCustomLists] = useState(JSON.parse(localStorage.getItem('customLists')) || [])

    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hasLoadedSidebarData, setHasLoadedSidebarData] = useState(false);
    const [sideBarAnimeIsLoading, setSideBarAnimeIsLoading] = useState(false);
    const [sidebarDataFailed, setSidebarDataFailed] = useState(false)
    const [topAnimeFailed, setTopAnimeFailed] = useState(false)
    const [genresFailed, setGenresFailed] = useState(false)
    const [genresLoading, setGenresLoading] = useState(false)
    const [topAnimeIsLoading, setTopAnimeIsLoading] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchCache, setSearchCache] = useState({});
    const [sidebarAnimeCache, setSidebarAnimeCache] = useState({});

    const [sideBarAnimepage, setSideBarAnimepage] = useState(1);
    const [sideBarAnimePageCache, setSideBarAnimePageCache] = useState(1);

    const [genreForSeeMorePage, setGenreForSeeMorePage] = useState("");
    const [customListInputValue, setCustomListInputValue] = useState("");


    const [filters, setFilters] = useState({
        query: "",
        status: "",
        type: "",
        genre: "",
        sort: "",
        order: "desc",
    });

    const [favorites, setFavorites] = useState(
        JSON.parse(localStorage.getItem('favorites')) || []
    );

    const isFavorite = (anime) => favorites.some((fav) => fav.mal_id === anime.mal_id);

    const handleAddToFavorites = (anime) => {
        const updated = isFavorite(anime)
            ? favorites.filter((fav) => fav.mal_id !== anime.mal_id)
            : [...favorites, anime];
        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
    };




    const isAddedToAList = (anime) =>
        customLists.some(list => list.anime.some(a => a.mal_id === anime.mal_id));

    const createCustomList = (listName) => {
        if (!listName.trim()) return;
        setCustomLists((prev) => [...prev, { name: listName.trim(), anime: [] }]);
    };

    useEffect(() => {
        localStorage.setItem('customLists', JSON.stringify(customLists));
    }, [customLists]);

    const deleteCustomList = (indexToDelete) => {
        const updated = customLists.filter((list, index) => index !== indexToDelete)
        setCustomLists(updated)
    }





    const handleSearch = async ({ query, status, type, genre, sort }, page = 1) => {
        const cacheKey = `${query}-${status}-${type}-${genre}-${sort}-${filters.order}-${page}`;

        if (searchCache[cacheKey]) {
            setAnimeList(searchCache[cacheKey].anime);
            setCurrentPage(searchCache[cacheKey].currentPage);
            setTotalPages(searchCache[cacheKey].totalPages);
            setHasSearched(true);
            return;
        }

        setIsLoading(true);
        setHasSearched(true);

        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (status) params.append("status", status);
        if (type) params.append("type", type);
        if (genre) params.append("genres", genre);
        if (sort && sort !== "alphabetical") {
            params.append("order_by", sort);
            params.append("sort", filters.order);
        }
        params.append("page", page);
        params.append("limit", 21);

        try {
            const response = await axios.get(`https://api.jikan.moe/v4/anime?${params.toString()}`);
            let fetchedAnime = removeDuplicates(response.data.data) || [];

            if (sort === "alphabetical") {
                fetchedAnime = sortAlphabetically(fetchedAnime, filters.order);
            }

            setAnimeList(fetchedAnime);
            setCurrentPage(response.data.pagination.current_page);
            setTotalPages(response.data.pagination.last_visible_page);

            setSearchCache(prev => ({
                ...prev,
                [cacheKey]: {
                    anime: fetchedAnime,
                    currentPage: response.data.pagination.current_page,
                    totalPages: response.data.pagination.last_visible_page
                }
            }));
        } catch (error) {
            console.error("Error fetching anime:", error);
        } finally {
            setIsLoading(false);
        }
    };






    const fetchSidebarAnime = async () => {
        setSideBarAnimeIsLoading(true);
        try {
            const [upcomingRes, popularRes] = await Promise.all([
                axios.get("https://api.jikan.moe/v4/anime", {
                    params: {
                        status: "upcoming",
                        order_by: "popularity",
                        sort: "asc",
                        page: 1
                    }
                }),
                axios.get("https://api.jikan.moe/v4/anime", {
                    params: {
                        order_by: "popularity",
                        sort: "asc",
                        page: 1
                    }
                })
            ]);

            const filteredUpcomingRes = removeBuggedAnime(upcomingRes.data.data)
            const filteredPopularRes = removeBuggedAnime(popularRes.data.data)

            const topUpcoming = removeDuplicates(filteredUpcomingRes || []);
            const mostPopular = removeDuplicates(filteredPopularRes || []);

            setTopUpcomingAnime(topUpcoming);
            setMostPopularAnime(mostPopular);
            setSidebarDataFailed(false)
            setHasLoadedSidebarData(true);
        } catch (err) {
            console.error("Error loading sidebar data:", err);
            throw err;
        } finally {
            setSideBarAnimeIsLoading(false);
        }
    };

    const hasFetchedSidebarAnime = useRef(false);
    const sideBarAnimeRetryCount = useRef(0);
    const sideBarAnimeMaxRetries = 3;


    useEffect(() => {
        if (hasFetchedSidebarAnime.current) return;

        let retryTimeout;

        const fetchWithRetry = async () => {
            setSideBarAnimeIsLoading(true);
            try {
                await fetchSidebarAnime();
                hasFetchedSidebarAnime.current = true;
            } catch (error) {
                sideBarAnimeRetryCount.current += 1;
                if (sideBarAnimeRetryCount.current < sideBarAnimeMaxRetries) {
                    retryTimeout = setTimeout(fetchWithRetry, 1500);
                } else {
                    hasFetchedSidebarAnime.current = true;
                    console.error("Failed to fetch sidebar data after retries.");
                    setSidebarDataFailed(true)
                    setSideBarAnimeIsLoading(false);
                }
            }
        };

        const timeout = setTimeout(fetchWithRetry, 1500);

        return () => {
            clearTimeout(timeout);
            clearTimeout(retryTimeout);
        }
    }, []);








    const fetchTopAnime = async (page = 1) => {
        setTopAnimeIsLoading(true);
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/top/anime?filter=airing&page=${page}&limit=20`);
            const result = removeDuplicates(response.data.data);
            setTopAnime(result);
            setTopAnimeFailed(false)
        } catch (error) {
            console.error('Error fetching top anime:', error);
            throw error;
        } finally {
            setTopAnimeIsLoading(false);
        }
    };

    const hasFetchedTopAnime = useRef(false);
    const topAnimeRetryCount = useRef(0);
    const topAnimeMaxRetries = 3;

    useEffect(() => {
        if (hasFetchedTopAnime.current) return;

        let retryTimeout;

        const fetchWithRetry = async () => {
            try {
                await fetchTopAnime();
                hasFetchedTopAnime.current = true;
            } catch (error) {
                topAnimeRetryCount.current += 1;
                if (topAnimeRetryCount.current < topAnimeMaxRetries) {
                    retryTimeout = setTimeout(fetchWithRetry, 1500);
                } else {
                    hasFetchedTopAnime.current = true;
                    console.error("Failed to fetch top anime after retries.");
                    setTopAnimeFailed(true)
                }
            }
        };

        fetchWithRetry();

        return () => {
            clearTimeout(retryTimeout);
        };
    }, []);







    const fetchGenres = async () => {
        setGenresLoading(true);
        try {
            const response = await axios.get("https://api.jikan.moe/v4/genres/anime");
            setAnimeGenres(response.data.data || []);
            setGenresFailed(false)
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        } finally {
            setGenresLoading(false);
        }
    };

    const hasFetchedGenres = useRef(false);
    const genresRetryCount = useRef(0);
    const genresMaxRetries = 3;

    useEffect(() => {
        if (hasFetchedGenres.current) return;

        let retryTimeout;

        const fetchWithRetry = async () => {
            try {
                await fetchGenres();
                hasFetchedGenres.current = true;
            } catch (error) {
                genresRetryCount.current += 1;
                if (genresRetryCount.current < genresMaxRetries) {
                    retryTimeout = setTimeout(fetchWithRetry, 1500);
                } else {
                    hasFetchedGenres.current = true;
                    console.error("Failed to fetch genres after retries.");
                    setGenresFailed(true)
                }
            }
        };

        fetchWithRetry();

        return () => {
            clearTimeout(retryTimeout);
        };
    }, []);












    const resetSearch = () => {
        setAnimeList([]);
        setFilters({
            query: "",
            status: "",
            type: "",
            genre: "",
            sort: "",
            order: "desc",
        });
        setHasSearched(false);
    };




    const contextValue = {
        // States
        animeCardIsOpen,
        setAnimeCardIsOpen,
        seeMorePageIsOpen,
        setSeeMorePageIsOpen,

        animeList,
        setAnimeList,
        animeGenres,
        setAnimeGenres,

        hasSearched,
        setHasSearched,

        isLoading,
        setIsLoading,

        isSidebarOpen,
        setIsSidebarOpen,

        hasLoadedSidebarData,
        setHasLoadedSidebarData,

        sideBarAnimeIsLoading,
        setSideBarAnimeIsLoading,

        sidebarDataFailed,
        setSidebarDataFailed,

        topAnimeFailed,
        setTopAnimeFailed,

        genresFailed,
        setGenresFailed,

        genresLoading,
        setGenresLoading,

        topAnimeIsLoading,
        setTopAnimeIsLoading,

        currentPage,
        setCurrentPage,

        totalPages,
        setTotalPages,

        searchCache,
        setSearchCache,

        sidebarAnimeCache,
        setSidebarAnimeCache,

        sideBarAnimepage,
        setSideBarAnimepage,

        sideBarAnimePageCache,
        setSideBarAnimePageCache,

        genreForSeeMorePage,
        setGenreForSeeMorePage,

        filters,
        setFilters,

        favorites,
        setFavorites,

        topAnime,
        setTopAnime,
        topUpcomingAnime,
        setTopUpcomingAnime,
        mostPopularAnime,
        setMostPopularAnime,

        addAnimeToListsButtonDropDownIsOpen,
        setAddAnimeToListsButtonDropDownIsOpen,

        customLists,
        setCustomLists,

        customListInputValue,
        setCustomListInputValue,

        editingListId,
        setEditingListId,

        // Functions
        removeDuplicates,
        removeBuggedAnime,
        sortAlphabetically,

        handleSearch,
        handleAddToFavorites,
        isFavorite,

        fetchSidebarAnime,
        fetchTopAnime,
        fetchGenres,

        resetSearch,

        createCustomList,
        deleteCustomList,

        isAddedToAList,

        // Refs
        hasFetchedTopAnime,
        hasFetchedSidebarAnime,
        hasFetchedGenres,
    };




    return (
        <AnimeContext.Provider value={contextValue}>{children}</AnimeContext.Provider>
    );
}

export default AnimeContext;
