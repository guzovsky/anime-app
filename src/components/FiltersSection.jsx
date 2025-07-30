import { useState, useRef, useEffect, useContext } from "react";
import AnimeContext from "../contexts/AnimeContext";
import '../styles/filtersSection.css';
import CustomSelect from "./CustomSelect";

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
    { label: "Popularity", value: "popularity" },
];

function FiltersSection({ onSearch }) {
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const { animeGenres, filters, setFilters } = useContext(AnimeContext);
    const dropdownRef = useRef(null);
    const isAllEmpty = [filters.query.trim(), filters.status, filters.type, filters.genre, filters.sort].every(val => val === "");

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
                <CustomSelect
                    name="status"
                    value={filters.status}
                    onChange={onFilterChange}
                    options={STATUS_OPTIONS}
                />

                <CustomSelect
                    name="type"
                    value={filters.type}
                    onChange={onFilterChange}
                    options={TYPE_OPTIONS}
                />

                <CustomSelect
                    name="genre"
                    value={filters.genre}
                    onChange={onFilterChange}
                    options={[
                        { label: "Genres", value: "" },
                        ...animeGenres
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((g) => ({ label: g.name, value: g.mal_id }))
                    ]}
                />



                <div className="select-wrapper sort-dropdown" ref={dropdownRef}>
                    <button
                        className="sort-dropdown-toggle"
                        onClick={() => setSortDropdownOpen((prev) => !prev)}
                    >
                        {filters.sort
                            ? SORT_OPTIONS.find((opt) => opt.value === filters.sort)?.label
                            : "Sort By"}{" "}
                        {filters.sort
                            ? filters.sort === "popularity"
                                ? filters.order === "asc"
                                    ? "▾"
                                    : "▴"
                                : filters.order === "asc"
                                    ? "▴"
                                    : "▾"
                            : ""}
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
                                            setFilters((prev) => ({
                                                ...prev,
                                                sort: opt.value,
                                                order: opt.value === "popularity" ? "asc" : "desc", // 👈 default to ASC only for popularity
                                            }));
                                        }
                                        setSortDropdownOpen(false);
                                    }}
                                >
                                    {opt.label}{" "}
                                    {filters.sort === opt.value
                                        ? opt.value === ""
                                            ? "" :
                                            opt.value === "popularity"
                                                ? filters.order === "asc"
                                                    ? "▾"
                                                    : "▴"
                                                : filters.order === "asc"
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

                <button
                    className="filters-search-btn"
                    disabled={isAllEmpty}
                    onClick={() => {
                        if (isAllEmpty) return;
                        onSearch();
                    }}
                >
                    Search
                </button>
            </div>
        </div>
    );
}

export default FiltersSection;
