import { useContext, useRef, useState } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import SideBarAnimeCards from "./SideBarAnimeCards";
import "./sideBarCategories.css";
import { CSSTransition } from "react-transition-group";
import { Link, useNavigate } from "react-router-dom";
import { RotateCcw, MoveDown } from 'lucide-react';


const SideBarCategories = ({ title, animeToDisplay, statusFilter }) => {
    const nodeRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    const {
        isFavorite,
        handleAddToFavorites,
        setIsSidebarOpen,
        sidebarDataFailed,
        setSidebarDataFailed,
        fetchSidebarAnime,
        setGenreForSeeMorePage,
        setSideBarAnimepage,

    } = useContext(AnimeContext);

    const navigate = useNavigate();

    return (
        <div className="sidebar-category-container">

            <div
                className={`sidebar-category-title ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <p>{title}</p><span className="arrow">▾</span>
            </div>

            <CSSTransition
                in={isOpen}
                timeout={300}
                classNames="sidebar-slide"
                unmountOnExit
                nodeRef={nodeRef}
            >
                <div ref={nodeRef}>
                    {sidebarDataFailed ? (
                        <div className="sidebar-error-container">
                            <p>An error has occurred. <br></br> Please try again.</p>

                            <button className="sidebar-retry-btn"
                                onClick={async () => {
                                    setSidebarDataFailed(false);
                                    await fetchSidebarAnime();
                                }}
                            >
                                <RotateCcw />
                            </button>

                            <p>Or try seeing the Anime in full screen by clicking the <span className="span">See More</span> button below </p>
                            <MoveDown />

                        </div>
                    ) : (
                        <div className="sidebar-card-container">
                            {animeToDisplay.slice(0, 5).map((anime) => (
                                <SideBarAnimeCards
                                    setIsSidebarOpen={setIsSidebarOpen}
                                    key={anime.mal_id}
                                    anime={anime}
                                    isFavorite={isFavorite}
                                    onFavoriteToggle={handleAddToFavorites}
                                    showAddButton={true}
                                />
                            ))}
                        </div>
                    )}


                    <div className="sidebar-see-more-btn-container">
                        <Link
                            className="sidebar-see-more-btn"
                            to={`/category/${statusFilter}`}
                            onClick={() => {
                                setIsSidebarOpen(false);
                                setGenreForSeeMorePage("");
                                setSideBarAnimepage(1);
                            }}

                        >
                            See More
                        </Link>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default SideBarCategories;
