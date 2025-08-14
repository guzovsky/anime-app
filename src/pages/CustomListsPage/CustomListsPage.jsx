import CustomListsPageLists from "./CustomListsPageLists"
import "./customListsPage.css"
import CustomListsPageSearchBar from "./CustomListsPageSearchBar"
import AnimeContext from "../../contexts/AnimeContext"
import { useContext } from "react"


function CustomListsPage() {

    const {
        customLists,
    } = useContext(AnimeContext)

    return (
        <div className="container custom-lists-page">
            {customLists.length > 0 ? (
                <>
                    <h1>Explore your custom lists!</h1>
                </>
            ) : (
                <h1>You don't have any Custom Lists yet. Try creating some!</h1>
            )}
            <CustomListsPageSearchBar />
            <CustomListsPageLists customLists={customLists} />
        </div>
    )
}

export default CustomListsPage