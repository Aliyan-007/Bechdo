"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  clearFavorites: () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("rasta-favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  }, []);

  const updateList = (newList: string[]) => {
    setFavorites(newList);
    if (mounted) {
      localStorage.setItem("rasta-favorites", JSON.stringify(newList));
    }
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      updateList(favorites.filter((f) => f !== id));
    } else {
      updateList([...favorites, id]);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const clearFavorites = () => {
    updateList([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
