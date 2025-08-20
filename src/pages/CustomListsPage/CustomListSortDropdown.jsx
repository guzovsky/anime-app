import { useState, useRef, useEffect } from "react";


const SORT_OPTIONS = [
    { label: "Sort By", value: "" },
    { label: "A-Z", value: "alphabetical" },
    { label: "Date added", value: "date-added" },
];


function CustomListSortDropdown({ list, setCustomLists }) {
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

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


    const [optionSelected, setOptionSelected] = useState({
        sortBy: { name: "Sort By", value: "" },
        order: "desc"
    });



    useEffect(() => {
        const handleSortChange = (list, optionSelected) => {
            if (optionSelected.sortBy.value === "alphabetical") {
                return [...list.anime].sort((a, b) => {
                    return optionSelected.order === "asc"
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title);
                });
            }

            if (optionSelected.sortBy.value === "date-added") {
                return [...list.anime].sort((a, b) => {
                    const dateA = new Date(a.addedAt);
                    const dateB = new Date(b.addedAt);

                    return optionSelected.order === "asc"
                        ? dateA - dateB
                        : dateB - dateA;
                });
            }

            return list.anime;
        };

        const sortedAnime = handleSortChange(list, optionSelected)

        setCustomLists(prevLists =>
            prevLists.map(l => l.id === list.id ? { ...l, anime: sortedAnime } : l)
        );

    }, [optionSelected]);



    return (
        <div className="custom-list-sort-dropdown-filters-container">
            <div className="custom-list-sort-dropdown-select-elements-container">
                <div className="custom-list-sort-dropdown-select-wrapper custom-list-sort-dropdown-sort-dropdown" ref={dropdownRef}>
                    <button
                        className="custom-list-sort-dropdown-sort-dropdown-toggle"
                        onClick={() => setSortDropdownOpen((prev) => !prev)}
                    >
                        {optionSelected.sortBy.value
                            ? optionSelected.sortBy.name
                            : "Sort By"}

                        {" "}

                        {optionSelected.sortBy.value
                            ? optionSelected.order === "asc"
                                ? "▴"
                                : "▾"
                            : ""}
                    </button>

                    {sortDropdownOpen && (
                        <div className="custom-list-sort-dropdown-sort-options-list">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    className={`custom-list-sort-dropdown-sort-option ${optionSelected.sortBy.value === opt.value ? "active" : ""}`}
                                    onClick={() => {
                                        if (opt.value === "") {
                                            setOptionSelected({ sortBy: { name: opt.label, value: opt.value }, order: "desc" });
                                        } else if (optionSelected.sortBy.value === opt.value) {
                                            setOptionSelected((prev) => ({
                                                ...prev,
                                                order: prev.order === "asc" ? "desc" : "asc",
                                            }));
                                        } else {
                                            setOptionSelected({ sortBy: { name: opt.label, value: opt.value }, order: "desc" });
                                        }

                                        setSortDropdownOpen(false);
                                    }}
                                >
                                    {opt.label}

                                    {" "}

                                    {optionSelected.sortBy.value === opt.value
                                        ? opt.value === ""
                                            ? "" :
                                            optionSelected.order === "asc"
                                                ? "▴"
                                                : "▾"
                                        : ""}
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    )

}

export default CustomListSortDropdown