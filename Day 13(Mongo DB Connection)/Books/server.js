import express from "express";
import mongoose from "mongoose";
import Books from "./books.js";
import env from "dotenv";

env.config();

const app = express();

app.use(express.json());
console.log(process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));



// GET ALL RECIPES
app.get("/books", async (req, res) => {

  try {
    const books = await Books.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET SINGLE RECIPE
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// CREATE RECIPE
app.post("/books", async (req, res) => {
  try {
    console.log(req.body);
    const book = new Books(req.body);

    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// UPDATE RECIPE
app.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Books.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// DELETE RECIPE

app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Books.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});