import React, { useContext } from 'react';
import './ToggleTheme.css';
import { ThemeContext } from './ThemeContext';

export const Toggle = () => {  
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const handleToggle = () => {
    const newDarkMode = !darkMode;
    toggleDarkMode();    
    document.documentElement.setAttribute('data-bs-theme', newDarkMode ? 'dark' : 'light');
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
