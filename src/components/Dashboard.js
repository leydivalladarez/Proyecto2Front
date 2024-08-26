import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../common/Layout';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout onLogout={handleLogout}>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        <div className="text-center">
          <h1>Bienvenido al Sistema Contable</h1>
          <p>
            Por favor, seleccione una opción del menú a la izquierda para comenzar.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
