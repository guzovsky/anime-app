import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/Favorites";
import AnimeInformation from "./pages/AnimeInformation";
import SeeMorePage from "./pages/SeeMorePage/SeeMorePage";
import CustomListsPage from "./pages/CustomListsPage/CustomListsPage.jsx";

function App() {

  return (
    <>
      <Sidebar />
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/anime/:id" element={<AnimeInformation />} />
        <Route path="/category/:categoryType" element={<SeeMorePage />} />
        <Route path="/custom-lists" element={<CustomListsPage />} />
      </Routes>
    </>
  );
}

export default App;