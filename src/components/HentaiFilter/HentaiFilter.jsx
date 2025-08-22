import { useEffect, useState, useContext } from "react"
import "./HentaiFilter.css";
import AnimeContext from "../../contexts/AnimeContext";


function HentaiFilter({ filterHentai, setFilterHentai }) {


    const toggleSwitch = () => {
        setFilterHentai(prev => !prev);
    };

    return (
        <div className="hentai-filter-container">
            <p>Filter Hentai Results</p>
            <button className={`hentai-filter-btn ${filterHentai ? "on" : ""}`} onClick={toggleSwitch}>
                <span className="hentai-filter-toggle-circle" />
            </button>
        </div>
    )
}

export default HentaiFilter