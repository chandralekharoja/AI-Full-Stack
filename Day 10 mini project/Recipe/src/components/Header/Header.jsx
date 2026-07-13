import "./Header.css";
import { NavLink } from "react-router-dom";
import { FaUtensils, FaHeart } from "react-icons/fa";

function Header() {
  return (
    <header className="header">

      <div className="logo">
        <FaUtensils />
        <span>Recipe Finder</span>
      </div>

      <nav>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Categories
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaHeart className="heart" />
          Favorites
        </NavLink>

      </nav>

    </header>
  );
}

export default Header;