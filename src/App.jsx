import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/Favorites";
import AnimeInformation from "./pages/AnimeInformation";
import SeeMorePage from "./pages/SeeMorePage/SeeMorePage";
import CustomListsPage from "./pages/CustomListsPage/CustomListsPage.jsx";
import FullScreenList from "./pages/CustomListsPage/FullScreenList.jsx";
import LoginOrRegisterModal from "./components/LoginOrRegisterModal/LoginOrRegisterModal.jsx";
import MyProfilePage from "./pages/MyProfilePage/MyProfilePage.jsx";

function App() {

  return (
    <>
      <LoginOrRegisterModal />
      <SideBar />
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/anime/:id" element={<AnimeInformation />} />
        <Route path="/category/:categoryType" element={<SeeMorePage />} />
        <Route path="/custom-lists" element={<CustomListsPage />} />
        <Route path="/custom-lists/:listName" element={<FullScreenList />} />
        <Route path="/myprofile" element={<MyProfilePage />} />
      </Routes>
    </>
  );
}

export default App;