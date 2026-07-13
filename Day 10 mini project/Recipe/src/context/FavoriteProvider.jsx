import { createContext, useEffect, useState } from "react";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipe) => {
    const exists = favorites.find(
      (item) => item.idMeal === recipe.idMeal
    );

    if (exists) {
      setFavorites(
        favorites.filter(
          (item) => item.idMeal !== recipe.idMeal
        )
      );
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};