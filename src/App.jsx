import { Routes, Route } from "react-router-dom";
import SideBar from "./components/sidebar/Sidebar.jsx";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/Favorites";
import AnimeInformation from "./pages/AnimeInformation";
import SeeMorePage from "./pages/SeeMorePage/SeeMorePage";
import CustomListsPage from "./pages/CustomListsPage/CustomListsPage.jsx";

function App() {

  return (
    <>
      <SideBar />
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