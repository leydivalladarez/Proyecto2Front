import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatWidget from './components/ChatWidget';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './components/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import useLocalStorage from "use-local-storage";

function App() {
  const isAuthenticated = localStorage.getItem('token'); // Verifica si el usuario está autenticado
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);
  document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  return (
    <Router>
      <div>
      <ChatWidget />
      <AppRoutes isAuthenticated={isAuthenticated} />
      </div>
    </Router>
  );
}

export default App;
