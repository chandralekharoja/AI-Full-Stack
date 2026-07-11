import { useState } from "react";
import "./search.css";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  function handleSearch() {
    onSearch(city);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      onSearch(city);
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;