import recipes from "./recipe.js";
import express from "express";
const app = express();


app.put("/recipes/:id", (req, res) => {

  const recipe = recipes.find(r => r.id === Number(req.params.id));

  if (!recipe) {
    return res.status(404).send("Recipe not found");
  }

  recipe.name = req.body.name;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;

  res.send(recipe);
});