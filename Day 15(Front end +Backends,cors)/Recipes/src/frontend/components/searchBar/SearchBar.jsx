import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

function SearchBar({ search, setSearch, onSearch }) {
  return (
    <div className="search-container">

      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={onSearch}>
        <FaSearch />
      </button>

    </div>
  );
}

export default SearchBar;