import CustomListsPageLists from "./CustomListsPageLists"
import "./customListsPage.css"
import CustomListsPageSearchBar from "./CustomListsPageSearchBar"
import AnimeContext from "../../contexts/AnimeContext"
import { useContext } from "react"


function CustomListsPage() {

    const {
        filteredLists,
        searchForAListInputIsFocused,
        setSearchForAListInputIsFocused,
        customListInputValue,
    } = useContext(AnimeContext)

    return (
        <div className="container custom-lists-page">
            {filteredLists.length > 0 ? (
                <>
                    <h1>Explore your custom lists!</h1>
                </>
            ) : (
                customListInputValue ? <h1>No results found</h1> : <h1>You don't have any Custom Lists yet. Try creating some!</h1>
            )}
            <p className="custom-lists-page-instructions">Search or create a list by clicking the plus button</p>

            <CustomListsPageSearchBar />
            <CustomListsPageLists />
        </div>
    )
}

export default CustomListsPage