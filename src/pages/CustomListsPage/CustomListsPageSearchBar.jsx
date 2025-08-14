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
            <input
                placeholder='Search for a list...'
                type="text"
                value={customListInputValue}
                onChange={handleChange}
            />
            <button onClick={() => {createCustomList(customListInputValue)}}><Plus /></button>
        </div>
    )
}

export default CustomListsPageSearchBar