import "./RecipeCard.css";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useContext } from "react";
import { FavoriteContext } from "../../context/FavoriteProvider";

function RecipeCard({ recipe }) {

  const { favorites, toggleFavorite } = useContext(FavoriteContext);

  const isFavorite = favorites.some(
    (item) => item.idMeal === recipe.idMeal
  );

  return (

    <div className="card">

      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
      />

      <button
        className="favorite-btn"
        onClick={() => toggleFavorite(recipe)}
      >

        {isFavorite ? <FaHeart /> : <FaRegHeart />}

      </button>

      <h3>{recipe.strMeal}</h3>

      <Link to={`/recipe/${recipe.idMeal}`}>
        View Recipe
      </Link>

    </div>

  );
}

export default RecipeCard;