import { useState, useRef, useEffect } from "react";

function CustomSelect({ name, options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || options[0]?.label;

    return (
        <div className="select-wrapper custom-dropdown" ref={dropdownRef}>
            <button className="custom-dropdown-toggle" onClick={() => setIsOpen((prev) => !prev)}>
                {selectedLabel}
            </button>

            {isOpen && (
                <div className="custom-options-list">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={`custom-option ${opt.value === value ? "active" : ""}`}
                            onClick={() => {
                                onChange({ target: { name, value: opt.value } });
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomSelect;
