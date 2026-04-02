import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, fontSizes, spacing, radius, shadow } from './theme';

type ThemeContextType = {
  isDark: boolean;
  colors: typeof lightColors;
  toggleTheme: () => void;
  fontSizes: typeof fontSizes;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Load saved preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem('app_theme_preference');
        if (stored) {
          setIsDark(stored === 'dark');
        }
      } catch (e) {
        console.error('Error loading theme preference', e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newThemeDark = !isDark;
    setIsDark(newThemeDark);
    try {
      await AsyncStorage.setItem('app_theme_preference', newThemeDark ? 'dark' : 'light');
    } catch (e) {
      console.error('Error saving theme preference', e);
    }
  };

  const currentTheme = {
    isDark,
    colors: isDark ? darkColors : lightColors,
    toggleTheme,
    fontSizes,
    spacing,
    radius,
    shadow,
  };

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Failsafe fallback
    return {
      isDark: false,
      colors: lightColors,
      toggleTheme: () => {},
      fontSizes,
      spacing,
      radius,
      shadow,
    };
  }
  return context;
};
