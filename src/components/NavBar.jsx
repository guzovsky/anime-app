import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import AnimeContext from "../contexts/AnimeContext";
import '../styles/navBar.css';
import { CSSTransition } from "react-transition-group";

function NavBar() {
    const nodeRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();
    const {
        animeCardIsOpen,
        animeList,
        resetSearch,
        hasSearched,
        setCurrentPage,
        setTotalPages,
        setIsSidebarOpen,
    } = useContext(AnimeContext);

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="side-bar-icon-container" onClick={() => setIsSidebarOpen(prev => !prev)}>
                    <button className="side-bar-icon">
                        ☰
                    </button>
                </div>

        
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

                <CSSTransition
                    in={animeCardIsOpen}
                    timeout={200}
                    classNames="nav-link-anime-info"
                    unmountOnExit
                    nodeRef={nodeRef}
                >
                    <div ref={nodeRef}>
                        <Link
                            to={`/anime/${animeCardIsOpen}`}
                            className={`nav-link ${location.pathname === `/anime/${animeCardIsOpen}` ? 'active' : ''}`}
                        >
                            Anime Info
                        </Link>
                    </div>
                </CSSTransition>




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
