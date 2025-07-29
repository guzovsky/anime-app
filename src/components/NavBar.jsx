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
    } = useContext(AnimeContext);

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <Link
                    to="/"
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        if ((animeList.length > 0 || hasSearched) && location.pathname === '/') {
                            resetSearch();
                        }
                        navigate("/");
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
