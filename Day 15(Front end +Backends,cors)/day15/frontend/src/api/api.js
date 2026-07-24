import axios from "axios";

console.log(import.meta.env.VITE_API_URL);
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const API = {
  signup(data) {
    return http.post("/signup", data);
  },

  login(data) {
    return http.post("/login", data);
  },

  profile(token) {
    return http.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  addRecipe(data, token) {
    return http.post("/recipes", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getRecipes(token) {
    return http.get("/recipes/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ADD THIS FUNCTION
  getCategories(token) {
    return http.get("/recipes/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  searchRecipes(search, token) {
    return http.get(`/recipes/search/${search}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ADD THIS FUNCTION
  getRecipesByCategory(category, token) {
    return http.get(`/recipes/category/${category}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getRecipeById(id, token) {
    return http.get(`/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteRecipe(id, token) {
    return http.delete(`/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateRecipe(id, data, token) {
    return http.put(`/recipes/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default API;
