import { useEffect, useState } from "react";
import API from "../../api/api";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import RecipeCard from "../RecipeCard/RecipeCard";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";

import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Seafood");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get Categories
  const getCategories = async () => {
    try {
      const response = await API.get("categories.php");
      setCategories(response.data.categories);
    } catch (err) {
      setError("Unable to load categories.");
    }
  };

  // Get Recipes by Category
  const getRecipes = async (category) => {
    try {
      setLoading(true);

      const response = await API.get(
        `filter.php?c=${category}`
      );

      setRecipes(response.data.meals);
      setError("");
    } catch (err) {
      setError("Unable to load recipes.");
    }

    setLoading(false);
  };

  useEffect(() => {
    getCategories();
    getRecipes(selectedCategory);
  }, []);

  const handleCategory = (category) => {
    setSelectedCategory(category);
    getRecipes(category);
  };

  return (
    <>
      <Header />

      <div className="category-page">

        <h1>Recipe Categories 🍽</h1>

        <div className="category-buttons">
          {categories.map((item) => (
            <button
              key={item.idCategory}
              onClick={() =>
                handleCategory(item.strCategory)
              }
            >
              {item.strCategory}
            </button>
          ))}
        </div>

        {loading && <Loading />}

        {!loading && error && (
          <Error message={error} />
        )}

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

export default Categories;