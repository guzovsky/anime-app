import { useContext, useRef } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import "./sideBar.css";
import SideBarCategories from "./SideBarCategories";
import { CSSTransition } from "react-transition-group";

function SideBar() {
    const nodeRef = useRef(null);

    const {
        isSidebarOpen,
        setIsSidebarOpen,
        mostPopularAnime,
        topUpcomingAnime,
        topAnime,
    } = useContext(AnimeContext);

    return (
        <CSSTransition
            in={isSidebarOpen}
            timeout={200}
            classNames="sidebar-animation"
            unmountOnExit
            nodeRef={nodeRef}
        >
            <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}>
                <div
                    className="sidebar-container"
                    onClick={(e) => e.stopPropagation()}
                    ref={nodeRef}
                >
                    <div className="sidebar-close-btn-and-header-container">
                        <h2>Explore Some Recommended Categories</h2>
                        <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
                    </div>
                    <div className="sidebar-contents-container">
                        <SideBarCategories 
                            title="Top Upcoming Anime" 
                            animeToDisplay={topUpcomingAnime}    
                        />
                        <SideBarCategories 
                            title="Most Popular Anime" 
                            animeToDisplay={mostPopularAnime}    
                        />
                        <SideBarCategories 
                            title="Top Airing Anime" 
                            animeToDisplay={topAnime}    
                        />
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default SideBar