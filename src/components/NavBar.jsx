import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AnimeContext from "../contexts/AnimeContext";
import '../styles/navBar.css';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        animeCardIsOpen,
        animeList,
        resetSearch,
        hasSearched,
        setCurrentPage,
        setTotalPages
    } = useContext(AnimeContext);

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <Link
                    to="/"
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        const isHome = location.pathname === "/";
                        if ((animeList.length > 0 || hasSearched) && isHome) {
                            resetSearch();
                            setCurrentPage(1);
                            setTotalPages(1);
                        }
                        if (!isHome) {
                            navigate("/");
                        }
                    }}
                >
                    Home
                </Link>

                {animeCardIsOpen && (
                    <Link
                        to={`/anime/${animeCardIsOpen}`}
                        className={`nav-link ${location.pathname === `/anime/${animeCardIsOpen}` ? 'active' : ''}`}
                    >
                        Anime Info
                    </Link>
                )}

                <Link
                    to="/favorites"
                    className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
                >
                    Favorites
                </Link>
            </nav>
        </div>
    );
}

export default NavBar;
