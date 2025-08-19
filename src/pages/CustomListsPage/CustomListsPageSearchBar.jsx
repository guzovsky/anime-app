import { Search, Plus, } from 'lucide-react';
import { useState, useContext } from 'react';
import AnimeContext from "../../contexts/AnimeContext"

function CustomListsPageSearchBar() {
    const {
        createCustomList,
        customListInputValue,
        setCustomListInputValue,
        handleSearchList,
        setSearchForAListInputIsFocused,

    } = useContext(AnimeContext)

    const handleFocus = () => setSearchForAListInputIsFocused(true);
    const handleBlur = () => setSearchForAListInputIsFocused(false);


    const handleChange = (e) => {
        setCustomListInputValue(e.target.value);
        handleSearchList(e.target.value)
    };

    return (
        <>
            <div className='input-custom-list-container'>
                <div className='input-custom-list-search-icon'>
                    <Search />
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createCustomList(customListInputValue)
                        setCustomListInputValue("")
                    }}
                >

                    <input
                        maxLength={80}
                        placeholder='Type here...'
                        type="text"
                        value={customListInputValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}

                    />
                </form>

                <div className='input-custom-list-plus-icon'>
                    <button
                        onClick={() => {
                            createCustomList(customListInputValue)
                            setCustomListInputValue("")
                        }}
                    ><Plus /></button>
                </div>
            </div>            
        </>

    )
}

export default CustomListsPageSearchBar