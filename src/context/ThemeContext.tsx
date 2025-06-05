import React, { createContext, useState, useEffect, useContext } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  font: string;
  setTheme: (colors: Partial<ThemeColors>, font?: string) => void;
  resetTheme: () => void;
}

const defaultColors: ThemeColors = {
  primary: '#f43f5e',    // Rose
  secondary: '#3b82f6',  // Blue
  accent: '#a855f7',     // Purple
  background: '#f8fafc', // Slate 50
  surface: '#ffffff',    // White
  text: '#334155',       // Slate 700
};

const defaultFont = 'Inter, system-ui, sans-serif';

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  font: defaultFont,
  setTheme: () => {},
  resetTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ThemeColors>(() => {
    const savedColors = localStorage.getItem('pomodoro-theme-colors');
    return savedColors ? JSON.parse(savedColors) : defaultColors;
  });

  const [font, setFont] = useState<string>(() => {
    const savedFont = localStorage.getItem('pomodoro-theme-font');
    return savedFont || defaultFont;
  });

  useEffect(() => {
    // Apply theme to CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
    
    document.documentElement.style.setProperty('--font-main', font);
    
    // Save to localStorage
    localStorage.setItem('pomodoro-theme-colors', JSON.stringify(colors));
    localStorage.setItem('pomodoro-theme-font', font);
  }, [colors, font]);

  const setTheme = (newColors: Partial<ThemeColors>, newFont?: string) => {
    setColors(prevColors => ({
      ...prevColors,
      ...newColors,
    }));
    
    if (newFont) {
      setFont(newFont);
    }
  };

  const resetTheme = () => {
    setColors(defaultColors);
    setFont(defaultFont);
  };

  return (
    <ThemeContext.Provider value={{ colors, font, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};