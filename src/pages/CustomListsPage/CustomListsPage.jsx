import CustomListsPageLists from "./CustomListsPageLists"
import "./customListsPage.css"
import CustomListsPageSearchBar from "./CustomListsPageSearchBar"
import AnimeContext from "../../contexts/AnimeContext"
import { useContext } from "react"
import LoginOrRegisterBtn from "../../components/SideBar/LoginOrRegisterBtn"

function CustomListsPage() {

    const {
        filteredLists,
        customListInputValue,
        user,
    } = useContext(AnimeContext)

    return (
        <div className="container custom-lists-page">
            {user ? (
                <>
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
                </>
            ) : (
                <>
                    <h1>Please log in to see your Custom Lists.</h1>
                    <LoginOrRegisterBtn />
                </>
            )}

        </div>
    )
}

export default CustomListsPage