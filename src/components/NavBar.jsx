import { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AnimeContext from "../contexts/AnimeContext";
import '../styles/navBar.css';
import { CSSTransition } from "react-transition-group";
import { TableOfContents, House, HeartPlus, Info, PanelRightOpen, LayoutPanelTop, ScrollText, } from 'lucide-react';

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
        isSidebarOpen,
        seeMorePageIsOpen,
    } = useContext(AnimeContext);

    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 50) {
                // Always show when near the top
                setShowNav(true);
            } else if (currentScrollY < lastScrollY - 10) {
                // Scrolling up → show
                setShowNav(true);
            } else if (currentScrollY > lastScrollY + 10) {
                // Scrolling down → hide
                setShowNav(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);


    const handleSidebarToggle = () => {
        setIsSidebarOpen(prev => !prev);
    };


    return (
        <>
            {!showNav && !isSidebarOpen && (
                <div className="open-navbar-container">
                    <button onClick={() => setShowNav(true)}><PanelRightOpen size={22} /></button>
                </div>
            )}

            <div className={`navbar-container ${showNav ? "visible" : "hidden"}`}>
                <nav className="navbar">
                    <div className="side-bar-icon-container" onClick={handleSidebarToggle}>
                        <button className="side-bar-icon"><TableOfContents /></button>
                    </div>

                    <div>
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
                            <House size={28} />
                        </Link>
                    </div>


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
                                <Info size={28} />
                            </Link>
                        </div>
                    </CSSTransition>

                    <CSSTransition
                        in={seeMorePageIsOpen}
                        timeout={200}
                        className="nav-link-anime-info"
                        unmountOnExit
                        nodeRef={nodeRef}
                    >
                        <div ref={nodeRef}>
                            <Link
                                to={`/category/${seeMorePageIsOpen}`}
                                className={`nav-link ${location.pathname === `/category/${seeMorePageIsOpen}` ? 'active' : ''}`}

                            >
                                <LayoutPanelTop size={28} />
                            </Link>
                        </div>
                    </CSSTransition>

                    <div>
                        <Link
                            to="/favorites"
                            className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
                        >
                            <HeartPlus size={28} />
                        </Link>
                    </div>

                    <div>
                        <Link
                            to="/custom-lists"
                            className={`nav-link ${location.pathname === '/custom-lists' ? 'active' : ''}`}
                        >
                            <ScrollText size={28} />
                        </Link>
                    </div>

                </nav>
            </div>

        </>

    );
}

export default NavBar;
