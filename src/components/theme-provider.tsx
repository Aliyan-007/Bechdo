"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  };

  const applyTheme = (targetTheme: Theme) => {
    const nextResolved: ResolvedTheme =
      targetTheme === "system" ? getSystemTheme() : targetTheme;
    setResolvedTheme(nextResolved);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", nextResolved);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(nextResolved);
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("rasta-theme") as Theme | null;
    const initialTheme: Theme =
      saved === "light" || saved === "dark" || saved === "system"
        ? saved
        : "dark";
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    // Listen for OS system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = () => {
      const currentSaved = localStorage.getItem("rasta-theme") as Theme | null;
      if (currentSaved === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    localStorage.setItem("rasta-theme", nextTheme);
    applyTheme(nextTheme);
  };

  const toggleTheme = () => {
    const next: Theme =
      theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
