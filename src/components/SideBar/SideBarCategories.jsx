import { useContext, useRef, useState } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import SideBarAnimeCards from "./SideBarAnimeCards";
import "./sideBarCategories.css";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";

const SideBarCategories = ({ title, animeToDisplay, statusFilter }) => {
    const nodeRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    const {
        isFavorite,
        handleAddToFavorites,
        setIsSidebarOpen,
        resetSearch,
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
                    <div className="sidebar-card-container">
                        {animeToDisplay.length === 0 ? (
                            <p>No anime found.</p>
                        ) : (
                            animeToDisplay.slice(0, 5).map((anime) => (
                                <SideBarAnimeCards
                                    setIsSidebarOpen={setIsSidebarOpen}
                                    key={anime.mal_id}
                                    anime={anime}
                                    isFavorite={isFavorite}
                                    onFavoriteToggle={handleAddToFavorites}
                                    showAddButton={true}
                                />
                            ))
                        )}
                    </div>

                    <div className="sidebar-see-more-btn-container">
                        <button
                            className="sidebar-see-more-btn"
                            onClick={() => {
                                if (statusFilter === "airing") {
                                    navigate("/")
                                    resetSearch()
                                    setIsSidebarOpen(false);
                                    return
                                } else {
                                    const category = statusFilter === "upcoming"
                                        ? "upcoming"
                                        : "popular"
                                    navigate(`/category/${category}`);
                                    setIsSidebarOpen(false);
                                }
                            }}
                        >
                            See More
                        </button>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default SideBarCategories;
