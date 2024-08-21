import React, { useContext } from 'react';
import './ToggleTheme.css';
import { ThemeContext } from './ThemeContext';
import useLocalStorage from "use-local-storage";

export const Toggle = () => {  
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);

  const handleToggle = () => {
    const newDarkMode = !darkMode;
    toggleDarkMode();    
    document.documentElement.setAttribute('data-bs-theme', newDarkMode ? 'dark' : 'light');
    setIsDark(newDarkMode);
  };

  return (
    <div className="toggle-container">
      <input 
        type="checkbox" 
        className="toggle" 
        onChange={handleToggle} 
        checked={darkMode} 
        id="dark-mode-toggle"
      />
      <label htmlFor="dark-mode-toggle"></label>
    </div>
  );
};
