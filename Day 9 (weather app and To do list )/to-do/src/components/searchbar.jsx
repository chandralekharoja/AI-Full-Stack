function SearchBar({ search, setSearch }) {
  return (
    <input
      className="todo-search"
      placeholder="Search task..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default SearchBar;