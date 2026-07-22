import React, { useEffect, useState } from "react";
import API from "../api/api";
import RecipeCard from "../frontend/recipecard";

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    API.getRecipes(user_id)
      .then((res) => {
        setRecipes(res.data);
      })
      .catch((err) => {
        console.error("Failed to load recipes:", err);
      });
  }, []);

  const removeRecipe = (id) => {
    API.deleteRecipe(id).then(() => {
      setRecipes(recipes.filter((item) => item._id !== id));
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        My Recipes
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onDelete={removeRecipe}
            />
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
}

export default MyRecipes;