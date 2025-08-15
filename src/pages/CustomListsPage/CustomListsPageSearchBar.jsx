import { Search, Plus, } from 'lucide-react';
import { useState, useContext } from 'react';
import AnimeContext from "../../contexts/AnimeContext"

function CustomListsPageSearchBar() {
    const {
        createCustomList,
        customListInputValue,
        setCustomListInputValue,

    } = useContext(AnimeContext)

    const handleChange = (e) => {
        setCustomListInputValue(e.target.value);
    };

    return (
        <div className='input-custom-list-container'>
            <Search />

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createCustomList(customListInputValue)
                    setCustomListInputValue("")
                }}
            >

                <input
                    maxLength={80}
                    placeholder='Search for a list...'
                    type="text"
                    value={customListInputValue}
                    onChange={handleChange}
                />

            </form>

            <button
                onClick={() => {
                    createCustomList(customListInputValue)
                    setCustomListInputValue("")
                }}
            ><Plus /></button>

        </div>
    )
}

export default CustomListsPageSearchBar