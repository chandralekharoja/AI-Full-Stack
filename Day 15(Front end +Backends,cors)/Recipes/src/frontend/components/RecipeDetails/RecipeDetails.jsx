import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../../../api/api";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";

import "./RecipeDetails.css";

function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRecipe();
  }, []);

  const getRecipe = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.getRecipeById(id, token);

      setRecipe(response.data);

      setError("");
    } catch (err) {
      setError("Recipe not found");
    }

    setLoading(false);
  };

  if (loading) return <Loading />;

  if (error) return <Error message={error} />;

  return (
    <>
      <Header />

      <div className="details">

        <img
          src={recipe.image}
          alt={recipe.name}
        />

        <div className="details-content">

          <h1>{recipe.name}</h1>

          <h3>Category : {recipe.category}</h3>

          <h3>Cuisine : {recipe.cuisine}</h3>

          <h3>Preparation Time : {recipe.prepTime}</h3>

          <h3>Cooking Time : {recipe.cookTime}</h3>

          <h3>Servings : {recipe.servings}</h3>

          <h3>Difficulty : {recipe.difficulty}</h3>

          <h2>Ingredients</h2>

          <ul>

            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}

          </ul>

          <h2>Instructions</h2>

          <ol>

            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}

          </ol>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default RecipeDetails;