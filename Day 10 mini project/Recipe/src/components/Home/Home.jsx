import { useEffect, useState } from "react";
import API from "../../api/api";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SearchBar from "../searchBar/SearchBar";
import RecipeCard from "../RecipeCard/RecipeCard";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";

import "./Home.css";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("chicken");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getRecipes = async () => {
    try {
      setLoading(true);

      const response = await API.get(`search.php?s=${search}`);

      if (response.data.meals) {
        setRecipes(response.data.meals);
        setError("");
      } else {
        setRecipes([]);
        setError("No recipes found.");
      }
    } catch (err) {
      setError("Something went wrong.");
      setRecipes([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    getRecipes();
  }, []);

  const handleSearch = () => {
    getRecipes();
  };

  return (
    <>
      <Header />

      <div className="home">

        <h1 className="title">
          Find Your Favorite Recipe 🍳
        </h1>

        <SearchBar
          search={search}
          setSearch={setSearch}
          onSearch={handleSearch}
        />

        {loading && <Loading />}

        {!loading && error && <Error message={error} />}

        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
            />
          ))}
        </div>

      </div>

      <Footer />
    </>
  );
}

export default Home;