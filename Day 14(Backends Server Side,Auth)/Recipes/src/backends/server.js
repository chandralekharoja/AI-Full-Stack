import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import users from "./user.js";
import Recipe from "./recipe.js";
import auth from "./auth.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));
app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await users.create({
      username: req.body.username,

      email: req.body.email,

      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup Success",

      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await users.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(
      req.body.password,

      user.password,
    );

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login success",

      token: token,

      username: user.username,
      user_id: user._id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Getting recipes

app.get("/recipes/user", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipes = await Recipe.find({ user_id: req.user.userId });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/recipes/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Recipe ID" });
    }
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (recipe.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not your recipe" });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//post the recipes

app.post("/recipes", auth, async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      user_id: req.user.userId,
    });

    const saved = await recipe.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//update the recipes

app.put("/recipes/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Recipe ID" });
    }

    const updaterecipes = await Recipe.findById(req.params.id);
    if (!updaterecipes) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (updaterecipes.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not your recipe" });
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//delete the recipes

app.delete("/recipes/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Recipe ID" });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (recipe.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not your recipe" });
    }
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});
