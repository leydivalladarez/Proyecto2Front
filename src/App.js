import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatWidget from './components/ChatWidget';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './components/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const isAuthenticated = localStorage.getItem('token'); // Verifica si el usuario está autenticado
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
