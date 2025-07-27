import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AnimeContext from "../contexts/AnimeContext";
import '../styles/navBar.css';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const { animeList, animeCardIsOpen, resetSearch } = useContext(AnimeContext);

    return (
        <nav className="navbar">
            <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={(e) => {
                    e.preventDefault();

                    if (animeCardIsOpen) {
                        if (location.pathname === `/anime/${animeCardIsOpen}`) {
                            navigate(`/`);
                        } else {
                            navigate(`/anime/${animeCardIsOpen}`);
                        }
                    } else {
                        if (animeList.length > 0) {
                            resetSearch();
                        }
                        navigate('/');
                    }
                }}
            >
                Home
            </Link>
            <Link
                to="/favorites"
                className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
            >
                Favorites
            </Link>
        </nav>
    );
}

export default NavBar;