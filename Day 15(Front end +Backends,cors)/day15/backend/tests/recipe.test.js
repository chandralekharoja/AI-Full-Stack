import request from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import app from "../src/app.js";

dotenv.config();

const token = jwt.sign(
  {
    userId: "688123456789abcdef123456",
  },
  process.env.JWT_SECRET,
);

//using token
// POST /recipes tests
describe("POST /recipes", () => {
  it("creates a new recipe", async () => {
    const recipe = {
      name: "Chocolate Cake",

      category: "Dessert",

      cuisine: "American",

      image: "https://example.com/cake.jpg",

      ingredients: ["2 cups flour", "1 cup sugar", "2 eggs"],

      instructions: ["Mix ingredients", "Bake for 30 minutes"],

      prepTime: "15 mins",

      cookTime: "30 mins",

      servings: 4,

      difficulty: "Easy",
    };

    const response = await request(app)
      .post("/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(recipe);

    expect(response.statusCode).toBe(201);

    expect(response.body.name).toBe("Chocolate Cake");
  });

  it("returns 400 for invalid recipe data", async () => {
    const invalidRecipe = {
      name: "",

      category: "",

      ingredients: [],
    };

    const response = await request(app)
      .post("/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidRecipe);

    expect(response.statusCode).toBe(400);
  });
});

//Unhappy path
//getting rescipes without token
describe("GET /recipes", () => {
  it("should return 401 when token is missing", async () => {
    const response = await request(app).get("/recipes/user");

    expect(response.statusCode).toBe(401);
  });
});
