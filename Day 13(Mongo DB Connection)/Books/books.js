import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    publishedYear: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Books", bookSchema);