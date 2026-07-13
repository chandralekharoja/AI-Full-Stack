import { useContext } from "react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import RecipeCard from "../RecipeCard/RecipeCard";
import { FavoriteContext } from "../../context/FavoriteProvider";

import "./Favorites.css";

function Favorites() {

  const { favorites } = useContext(FavoriteContext);

  return (
    <>
      <Header />

      <div className="favorites">

        <h1>❤️ Favorite Recipes</h1>

        {favorites.length === 0 ? (

          <div className="empty">

            <h2>No Favorite Recipes</h2>

            <p>
              Click the ❤️ icon to save recipes.
            </p>

          </div>

        ) : (

          <div className="recipe-grid">

            {favorites.map((recipe) => (

              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
              />

            ))}

          </div>

        )}

      </div>

      <Footer />
    </>
  );
}

export default Favorites;