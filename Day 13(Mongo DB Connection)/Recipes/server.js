import express from "express";
import mongoose from "mongoose";
import Recipe from './recipe'
import env from "dotenv";

env.config();

const app = express();

app.use(express.json());
console.log(process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));



// =======================
// GET ALL RECIPES
// =======================

app.get("/recipes/:user_id",async(req,res)=>{

try{

const recipes=await Recipe.find({
    user_id:req.params.user_id
});


res.json(recipes);


}catch(err){

res.status(500).json({
message:err.message
});

}

});


// =======================
// GET SINGLE RECIPE
// =======================

app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =======================
// CREATE RECIPE
// =======================

app.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);

    const savedRecipe = await recipe.save();

    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// =======================
// UPDATE RECIPE
// =======================

app.put("/recipes/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// =======================
// DELETE RECIPE
// =======================

app.delete("/recipes/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({
      message: "Recipe deleted successfully",
      recipe: deletedRecipe
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});