import { Search } from 'lucide-react';

function CustomListsPageSearchBar() {
    return (
        <div className='input-custom-list-container'>
            <Search />
            <input type="text" placeholder='Search for a list...' />
        </div>
    )
}

export default CustomListsPageSearchBar