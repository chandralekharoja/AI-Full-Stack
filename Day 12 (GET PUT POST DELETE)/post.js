import recipes from "./recipe.js";
import express from "express";
const app = express();

app.post("/recipes", (req, res) => {

  const newRecipe = {
    id: recipes.length + 1,
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions
  };

  recipes.push(newRecipe);

  res.status(201).send(newRecipe);
});

app.listen(3000, () => console.log("http://localhost:3000/recipes/11"));