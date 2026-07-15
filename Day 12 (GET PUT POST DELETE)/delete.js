import recipes from "./recipe.js";
import express from "express";
const app = express();


app.delete("/recipes/:id", (req, res) => {

  const index = recipes.findIndex(r => r.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).send("Recipe not found");
  }

  recipes.splice(index, 1);

  res.send("Recipe deleted successfully");
});
