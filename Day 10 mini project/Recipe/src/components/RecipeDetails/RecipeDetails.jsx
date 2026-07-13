import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import API from "../../api/api";
import { FavoriteContext } from "../../context/FavoriteProvider";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";

import "./RecipeDetails.css";

function RecipeDetails() {
  const { id } = useParams();

  const { favorites, toggleFavorite } =
    useContext(FavoriteContext);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRecipe();
  }, []);

  const getRecipe = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        `lookup.php?i=${id}`
      );

      setRecipe(response.data.meals[0]);
      setError("");
    } catch (err) {
      setError("Recipe not found.");
    }

    setLoading(false);
  };

  if (loading) return <Loading />;

  if (error) return <Error message={error} />;

  const isFavorite = favorites.some(
    (item) => item.idMeal === recipe.idMeal
  );

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return (
    <>
      <Header />

      <div className="details">

        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
        />

        <div className="details-content">

          <div className="title-row">

            <h1>{recipe.strMeal}</h1>

            <button
              className="heart-btn"
              onClick={() => toggleFavorite(recipe)}
            >
              {isFavorite ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
            </button>

          </div>

          <h3>Category : {recipe.strCategory}</h3>

          <h3>Area : {recipe.strArea}</h3>

          <h2>Ingredients</h2>

          <ul>

            {ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}

          </ul>

          <h2>Instructions</h2>

          <p>{recipe.strInstructions}</p>

          {recipe.strYoutube && (
            <a
              href={recipe.strYoutube}
              target="_blank"
              rel="noreferrer"
              className="youtube-btn"
            >
              ▶ Watch on YouTube
            </a>
          )}

        </div>

      </div>

      <Footer />
    </>
  );
}

export default RecipeDetails;