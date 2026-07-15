import recipes from "./recipe.js";
import express from "express";


//Getting all data 
const app = express();
app.get("/recipes", (req, res) => {
res.send(recipes);
});
app.listen(3000, () => console.log("http://localhost:3000/recipes"));

//Getting single data

app.get("/recipes/:id", (req, res) => {
  const recipe = recipes.find(r => r.id === Number(req.params.id));

  if (!recipe) {
    return res.status(404).send("Recipe not found");
  }

  res.send(recipe);
});

app.listen(3000, () => console.log("http://localhost:3000/recipes/1"));