import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'default' | 'hybrid';
  setTheme: (theme: 'default' | 'hybrid') => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'default' | 'hybrid'>('default');

  const toggleTheme = () => {
    setTheme(prev => prev === 'default' ? 'hybrid' : 'default');
  };

  const getThemeClass = () => {
    if (theme === 'hybrid') return 'healthcare-theme hybrid-theme';
    return '';
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={getThemeClass()}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
