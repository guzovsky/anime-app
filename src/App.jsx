import HomePage from '../components/HomePage'
import NavBar from '../components/NavBar'
import FavoritesPage from '../components/Favorites'
import AnimeInformation from '../components/AnimeInformation';
import axios from 'axios';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [animeList, setAnimeList] = useState([]);

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favorites')) || []
  )

  const isFavorite = (anime) => favorites.some((fav) => fav.mal_id === anime.mal_id);

  const handleAddToFavorites = (anime) => {
    if (!isFavorite(anime)) {
      const updated = [...favorites, anime]
      setFavorites(updated)
      localStorage.setItem('favorites', JSON.stringify(updated))
    } else {
      const updated = favorites.filter((fav) => fav.mal_id !== anime.mal_id);
      setFavorites(updated)
      localStorage.setItem('favorites', JSON.stringify(updated))
    }
  }

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`);
      setAnimeList(response.data.data || []);
    } catch (error) {
      console.error('Error fetching anime:', error);
    }
  };


  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onSearch={handleSearch}
              animeList={animeList}
              handleAddToFavorites={handleAddToFavorites}
              isFavorite={isFavorite}
            />
          }
        />
        <Route path="/favorites" element={
          <FavoritesPage
            favorites={favorites}
            isFavorite={isFavorite}
            handleAddToFavorites={handleAddToFavorites}
          />
        }
        />
        <Route path="/anime/:id" element={<AnimeInformation />} />
      </Routes>
    </Router>
  );
}

export default App
