import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimeContext from './contexts/AnimeContext';
import SideBar from './components/SideBar/Sidebar';
import SeeMorePage from './pages/SeeMorePage';

import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import FavoritesPage from './pages/Favorites';
import AnimeInformation from './pages/AnimeInformation';
import axios from 'axios';

function removeDuplicates(animeArray) {
  const seen = new Set();
  return animeArray.filter(anime => {
    if (seen.has(anime.mal_id)) return false;
    seen.add(anime.mal_id);
    return true;
  });
}

function sortAlphabetically(animeList) {
  return [...animeList].sort((a, b) => a.title.localeCompare(b.title));
}

function App() {
  const [animeCardIsOpen, setAnimeCardIsOpen] = useState(null);

  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [topUpcomingAnime, setTopUpcomingAnime] = useState([])
  const [mostPopularAnime, setMostPopularAnime] = useState([])
  const [animeGenres, setAnimeGenres] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasLoadedSidebarData, setHasLoadedSidebarData] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topAnimePage, setTopAnimePage] = useState(1);

  const [searchCache, setSearchCache] = useState({});


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
        fetchedAnime = sortAlphabetically(fetchedAnime);
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





  const fetchTopAnime = async (page = 1) => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/top/anime?filter=airing&page=${page}`);
      const result = removeDuplicates(response.data.data);
      setTopAnime(prev => [...prev, ...result]);
    } catch (error) {
      console.error('Error fetching top anime:', error);
    }
  };

  useEffect(() => {
    fetchTopAnime(topAnimePage);
  }, [topAnimePage]);




  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("https://api.jikan.moe/v4/genres/anime");
        setAnimeGenres(response.data.data || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
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



  const displayedAnime = animeList.length > 0 ? animeList : topAnime;

  const contextValue = {
    animeCardIsOpen,
    setAnimeCardIsOpen,
    topAnime,
    displayedAnime,
    animeList,
    setAnimeList,
    isLoading,
    setIsLoading,
    handleSearch,
    favorites,
    isFavorite,
    handleAddToFavorites,
    resetSearch,
    removeDuplicates,
    animeGenres,
    setAnimeGenres,
    filters,
    setFilters,
    hasSearched,
    setHasSearched,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    topAnimePage,
    setTopAnimePage,
    isSidebarOpen,
    setIsSidebarOpen,
    topUpcomingAnime,
    setTopUpcomingAnime,
    mostPopularAnime,
    setMostPopularAnime,
    hasLoadedSidebarData,
    setHasLoadedSidebarData,

  };

  return (
    <AnimeContext.Provider value={contextValue}>
      <Router>
        <SideBar />
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/anime/:id" element={<AnimeInformation />} />
          <Route path="/category/:categoryType" element={<SeeMorePage />} />
        </Routes>
      </Router>
    </AnimeContext.Provider>
  );
}

export default App;
