import { Link, useLocation } from "react-router-dom";
import '../css/navBar.css';

function NavBar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
                Home
            </Link>
            <Link
                to="/favorites"
                className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
            >
                Favorites
            </Link>
        </nav>
    );
}

export default NavBar;
