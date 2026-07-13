import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { FavoriteProvider } from "./context/FavoriteProvider";

import Home from "./components/Home/Home";
import Categories from "./components/Categories/Categories";
import Favorites from "./components/Favorites/Favorites";
import RecipeDetails from "./components/RecipeDetails/RecipeDetails";

function App() {
  return (
    <FavoriteProvider>
      <BrowserRouter>

        <div className="app">

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/categories"
              element={<Categories />}
            />

            <Route
              path="/favorites"
              element={<Favorites />}
            />

            <Route
              path="/recipe/:id"
              element={<RecipeDetails />}
            />

          </Routes>

        </div>

      </BrowserRouter>
    </FavoriteProvider>
  );
}

export default App;