import { useState, useRef, useEffect, useContext } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import CustomSelect from "../../components/CustomSelect";

const SORT_OPTIONS = [
    { label: "Sort By", value: "" },
    { label: "Score", value: "score" },
    { label: "Start Date", value: "start_date" },
    { label: "End Date", value: "end_date" },
    { label: "Episodes", value: "episodes" },
    { label: "A-Z", value: "alphabetical" },
    { label: "Popularity", value: "popularity" },
];

function FiltersForSeeMorePage({ genre, setGenre }) {

    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    const {
        animeGenres,
    } = useContext(AnimeContext);
    
    const dropdownRef = useRef(null);

    const onFilterChange = (e) => {
        const { name, value } = e.target;
        setGenre(value);
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

            <div className="see-more-page select-elements-container">

                <CustomSelect
                    name="genre"
                    value={genre}
                    onChange={onFilterChange}
                    options={[
                        { label: "Genres", value: "" },
                        ...animeGenres
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((g) => ({ label: g.name, value: g.mal_id }))
                    ]}
                />


            </div>
        </div>
    )
}

export default FiltersForSeeMorePage;
