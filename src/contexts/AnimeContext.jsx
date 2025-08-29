import { createContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


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
    const [addAnimeToListsButtonDropDownIsOpen, setAddAnimeToListsButtonDropDownIsOpen] = useState({ id: null, type: null, listId: null });
    const [isEditingAnimeInList, setIsEditingAnimeInList] = useState(null)
    const [user, setUser] = useState(null);

    const [animeList, setAnimeList] = useState([]);
    const [topAnime, setTopAnime] = useState([]);
    const [topUpcomingAnime, setTopUpcomingAnime] = useState([])
    const [mostPopularAnime, setMostPopularAnime] = useState([])
    const [animeGenres, setAnimeGenres] = useState([]);
    const [customLists, setCustomLists] = useState([])
    const [filteredLists, setFilteredLists] = useState([]);
    const [rawAnimeList, setRawAnimeList] = useState([]);

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
    const [searchForAListInputIsFocused, setSearchForAListInputIsFocused] = useState(false);
    const [loginRegisterModalIsActive, setLoginRegisterModalIsActive] = useState(false);
    const [loginOrRegister, setLoginOrRegister] = useState("login");
    const [filterHentai, setFilterHentai] = useState(true)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sideBarAnimepage, setSideBarAnimepage] = useState(1);
    const [sideBarAnimePageCache, setSideBarAnimePageCache] = useState(1);

    const [searchCache, setSearchCache] = useState({});
    const [sidebarAnimeCache, setSidebarAnimeCache] = useState({});

    const [genreForSeeMorePage, setGenreForSeeMorePage] = useState("");
    const [customListInputValue, setCustomListInputValue] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;

    const [filters, setFilters] = useState({
        query: "",
        status: "",
        type: "",
        genre: "",
        sort: "",
        order: "desc",
    });

    const [favorites, setFavorites] = useState([]);

    const isFavorite = (anime) => favorites.some((fav) => fav.mal_id === anime.mal_id);

    const handleAddToFavorites = async (anime) => {
        if (!user) return;

        try {
            const res = await axios.put(`${API_URL}/users/favorites`, { anime }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setFavorites(res.data.favorites);
        } catch (err) {
            console.error("Failed to update favorites", err);
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchFavorites = async () => {
            try {
                const res = await axios.get(`${API_URL}/users/favorites`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setFavorites(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFavorites();
    }, [user]);






    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setUser({ ...res.data, token }))
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            });
    }, []);

    const registerUser = async (name, email, password) => {
        try {
            const res = await axios.post(`${API_URL}/users`, { name, email, password });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    const loginUser = async (name, password) => {
        try {
            const res = await axios.post(`${API_URL}/users/login`, { name, password });
            const token = res.data.token;
            localStorage.setItem("token", token);
            setUser({ ...res.data, token });
            setLoginRegisterModalIsActive(false)
        } catch (err) {
            setUser(null);
            throw err;
        }
    };




    const listExists = (listName) =>
        customLists.some(list => list.name.toLowerCase().trim() === listName.toLowerCase().trim());


    const isAddedToAList = (anime) =>
        customLists.some(list => list.anime.some(a => a.mal_id === anime.mal_id));


    const handleListsWithSameName = (listName) => {
        const baseName = listName.trim();
        const lowerBase = baseName.toLowerCase();

        const count = customLists.filter(list => {
            const lowerName = list.name.toLowerCase();
            return lowerName === lowerBase || lowerName.startsWith(`${lowerBase} `);
        }).length;

        const newName = count === 0 ? baseName : `${baseName} ${count}`;

        setCustomLists(prev => [
            ...prev,
            {
                id: uuidv4(),
                name: newName,
                anime: [],
                createdAt: new Date().toISOString(),
            }
        ]);
    };



    const createCustomList = (listName) => {
        if (!listName.trim()) return;

        const newList = {
            id: uuidv4(),
            name: listName.trim(),
            anime: [],
            createdAt: new Date().toISOString(),
        };

        if (listExists(listName)) {
            handleListsWithSameName(listName);
            return;
        }

        setCustomLists(prev => [...prev, newList]);
    };

    const handleSearchList = (query) => {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery) {
            setFilteredLists(customLists);
            return;
        }

        const filtered = customLists.filter(list =>
            list.name.toLowerCase().includes(trimmedQuery)
        );

        setFilteredLists(filtered);
    }



    const editListName = (newName, id) => {
        const trimmedName = newName.trim();
        if (!trimmedName) return;

        const newLists = [...customLists];

        const count = customLists.filter((list) => {
            if (list.id === id) return false;
            return list.name.toLowerCase() === trimmedName.toLowerCase() ||
                list.name.toLowerCase().startsWith(`${trimmedName.toLowerCase()} `);
        }).length;

        const index = newLists.findIndex(list => list.id === id);
        if (index === -1) return;

        newLists[index].name = count === 0 ? trimmedName : `${trimmedName} ${count}`;

        setCustomLists(newLists);
    };

    const deleteCustomList = (id) => {
        const updated = customLists.filter(list => list.id !== id);
        setCustomLists(updated);
    };


    useEffect(() => {
        setFilteredLists(customLists);
    }, [customLists]);

    useEffect(() => {
        if (!user) return;

        const saveCustomLists = async () => {
            try {
                await axios.put(`${API_URL}/users/custom-lists`, { customLists }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            } catch (err) {
                console.error("Failed to save custom lists", err);
            }
        };

        saveCustomLists();
    }, [customLists]);


    useEffect(() => {
        if (!user) return;

        const fetchCustomLists = async () => {
            try {
                const res = await axios.get(`${API_URL}/users/custom-lists`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setCustomLists(res.data);
            } catch (err) {
                console.error("Failed to fetch custom lists", err);
            }
        };

        fetchCustomLists();
    }, [user]);







    const handleSearch = async ({ query, status, type, genre, sort }, page = 1) => {
        const cacheKey = `${query}-${status}-${type}-${genre}-${sort}-${filters.order}-${page}`;

        if (searchCache[cacheKey]) {
            setRawAnimeList(searchCache[cacheKey].anime);
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

            setRawAnimeList(fetchedAnime);

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



    useEffect(() => {
        let finalList = rawAnimeList;

        if (filterHentai) {
            finalList = finalList.filter(
                a => !a.genres?.some(genre => genre.name === "Hentai")
            );
        }

        setAnimeList(finalList);
    }, [rawAnimeList, filterHentai, filters.sort, filters.order]);






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

        isEditingAnimeInList,
        setIsEditingAnimeInList,

        filteredLists,
        setFilteredLists,

        searchForAListInputIsFocused,
        setSearchForAListInputIsFocused,

        filterHentai,
        setFilterHentai,

        loginRegisterModalIsActive,
        setLoginRegisterModalIsActive,

        loginOrRegister,
        setLoginOrRegister,

        user,
        setUser,

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
        editListName,

        handleSearchList,

        loginUser,
        registerUser,

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
