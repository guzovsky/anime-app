import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimeContext from './contexts/AnimeContext';

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
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topAnime, setTopAnime] = useState([]);
  const [animeCardIsOpen, setAnimeCardIsOpen] = useState(null);
  const [animeGenres, setAnimeGenres] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  const handleSearch = async ({ query, status, type, genre, sort }) => {
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

    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?${params.toString()}`);
      let fetchedAnime = response.data.data || [];

      if (sort === "alphabetical") {
        fetchedAnime = sortAlphabetically(fetchedAnime);
      }

      setAnimeList(fetchedAnime);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const response = await axios.get('https://api.jikan.moe/v4/top/anime?filter=airing');
        setTopAnime(response.data.data || []);
      } catch (error) {
        console.error('Error fetching top anime:', error);
      }
    };
    fetchTopAnime();
  }, []);

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

  const displayedAnime = removeDuplicates(animeList.length > 0 ? animeList : topAnime);

  const contextValue = {
    animeCardIsOpen,
    setAnimeCardIsOpen,
    topAnime,
    displayedAnime,
    animeList,
    setAnimeList,
    isLoading,
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
    setHasSearched
  };

  return (
    <AnimeContext.Provider value={contextValue}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/anime/:id" element={<AnimeInformation />} />
        </Routes>
      </Router>
    </AnimeContext.Provider>
  );
}

export default App;
