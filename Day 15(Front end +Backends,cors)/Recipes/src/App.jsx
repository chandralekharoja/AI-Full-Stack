import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { FavoriteProvider } from "./frontend/context/FavoriteProvider";

// Authentication Pages
import Signup from "./frontend/signup";
import Login from "./frontend/login";
// Recipe App Pages
import Home from "./frontend/components/Home/Home";
import Categories from "./frontend/components/Categories/Categories";
import Favorites from "./frontend/components/Favorites/Favorites";
import RecipeDetails from "./frontend/components/RecipeDetails/RecipeDetails";
import EditRecipe from "./frontend/components/EditRecipe/EditRecipe";
function App() {
  return (
    <FavoriteProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>

            {/* Authentication */}
            <Route path="/" element={<Signup />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* User Recipe Dashboard */}
            <Route path="/home" element={<Home />} />

            {/* Recipe Finder */}
            <Route path="/recipes" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route
path="/edit-recipe/:id"
element={<EditRecipe />}
/>
          </Routes>
        </div>
      </BrowserRouter>
    </FavoriteProvider>
  );
}

export default App;