import { useState, useRef, useEffect, useContext } from "react";
import AnimeContext from "../contexts/AnimeContext";
import '../styles/filtersSection.css';

const STATUS_OPTIONS = [
    { value: "", label: "Status" },
    { value: "airing", label: "Airing" },
    { value: "completed", label: "Completed" },
    { value: "upcoming", label: "Upcoming" },
];

const TYPE_OPTIONS = [
    { value: "", label: "Types" },
    { value: "tv", label: "TV" },
    { value: "movie", label: "Movie" },
    { value: "ova", label: "OVA" },
    { value: "special", label: "Special" },
    { value: "ona", label: "ONA" },
    { value: "music", label: "Music" },
];

const SORT_OPTIONS = [
    { label: "Sort By", value: "" },
    { label: "Score", value: "score" },
    { label: "Start Date", value: "start_date" },
    { label: "End Date", value: "end_date" },
    { label: "Episodes", value: "episodes" },
    { label: "A-Z", value: "alphabetical" },
];

function FiltersSection({ onSearch }) {
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const { animeGenres, filters, setFilters } = useContext(AnimeContext);
    const dropdownRef = useRef(null);

    const onFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSortDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="filters-container">

            <div className="select-elements-container">
                <div className="select-wrapper">
                    <select name="status" value={filters.status} onChange={onFilterChange}>
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="select-wrapper">
                    <select name="type" value={filters.type} onChange={onFilterChange}>
                        {TYPE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="select-wrapper">
                    <select name="genre" value={filters.genre} onChange={onFilterChange}>
                        <option value="">Genres</option>
                        {[...animeGenres]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((genre) => (
                                <option key={genre.mal_id} value={genre.mal_id}>
                                    {genre.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="select-wrapper sort-dropdown" ref={dropdownRef}>
                    <button
                        className="sort-dropdown-toggle"
                        onClick={() => setSortDropdownOpen((prev) => !prev)}
                    >
                        {filters.sort
                            ? SORT_OPTIONS.find((opt) => opt.value === filters.sort)?.label
                            : "Sort By"}{" "}
                        {filters.sort &&
                            (filters.order === "desc" ? "▾" : "▴")}
                    </button>

                    {sortDropdownOpen && (
                        <div className="sort-options-list">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    className={`sort-option ${filters.sort === opt.value ? "active" : ""}`}
                                    onClick={() => {
                                        if (opt.value === "") {
                                            setFilters((prev) => ({
                                                ...prev,
                                                sort: "",
                                                order: "desc",
                                            }));
                                        } else if (filters.sort === opt.value) {
                                            setFilters((prev) => ({
                                                ...prev,
                                                order: prev.order === "asc" ? "desc" : "asc",
                                            }));
                                        } else {
                                            // Set new sort field
                                            setFilters((prev) => ({
                                                ...prev,
                                                sort: opt.value,
                                                order: "desc",
                                            }));
                                        }
                                        setSortDropdownOpen(false);
                                    }}
                                >
                                    {opt.label}{" "}
                                    {filters.sort === opt.value
                                        ? filters.order === "asc"
                                            ? "▴"
                                            : "▾"
                                        : ""}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="filters-search-btn-container">
                <button className="filters-search-btn" onClick={onSearch}>Search</button>
            </div>
        </div>
    );
}

export default FiltersSection;
