import CustomListsPageLists from "./CustomListsPageLists"
import "./customListsPage.css"
import CustomListsPageSearchBar from "./CustomListsPageSearchBar"

function CustomListsPage() {
    return (
        <div className="container custom-lists-page">
            <h1>You don't have any Custom Lists yet. Try creating some!</h1>
            <CustomListsPageSearchBar />
            <CustomListsPageLists />
            <CustomListsPageLists />
            <CustomListsPageLists />
            <CustomListsPageLists />
        </div>
    )
}

export default CustomListsPage