import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'; // Importa el archivo CSS para Dashboard

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column vh-100">
      <Header onLogout={handleLogout} />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          {/* Aquí va el contenido principal */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
