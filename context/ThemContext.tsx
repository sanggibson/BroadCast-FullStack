// ThemeContext.tsx
import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { DarkNavTheme, LightNavTheme } from "@/types/navigationTheme";
import { darkTheme, lightTheme } from "@/types/theme";

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === "dark");

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark ? darkTheme : lightTheme;
  const navTheme = isDark ? DarkNavTheme : LightNavTheme;

  return (
    <ThemeContext.Provider value={{ theme, navTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
