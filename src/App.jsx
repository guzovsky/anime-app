// App.jsx
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

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topAnime, setTopAnime] = useState([]);
  const [animeCardIsOpen, setAnimeCardIsOpen] = useState(null);

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

  const handleSearch = async (query) => {
    if (!query.trim()) return setAnimeList([]);
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`);
      setAnimeList(response.data.data || []);
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

  const resetSearch = () => {
    setAnimeList([]);
  };

  const displayedAnime = removeDuplicates(animeList.length > 0 ? animeList : topAnime);

  const contextValue = {
    animeCardIsOpen,
    setAnimeCardIsOpen,
    topAnime,
    displayedAnime,
    animeList,
    isLoading,
    handleSearch,
    favorites,
    isFavorite,
    handleAddToFavorites,
    resetSearch,
    removeDuplicates,
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
