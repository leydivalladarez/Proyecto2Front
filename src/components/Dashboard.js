import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <header className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Contabilidad Dashboard</a>
        <button onClick={handleLogout} className="btn btn-danger ms-auto">Logout</button>
      </header>
      <main className="flex-grow-1 p-4">
        <div className="row">
          <div className="col-md-3">
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Nómina</h5>
                <p className="card-text">Gestión de pagos y sueldos del personal.</p>
                <button className="btn btn-primary">Acceder</button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Activos</h5>
                <p className="card-text">Gestión de activos de la empresa.</p>
                <button className="btn btn-primary">Acceder</button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Contabilidad</h5>
                <p className="card-text">Gestión de registros contables.</p>
                <button className="btn btn-primary">Acceder</button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Facturación</h5>
                <p className="card-text">Gestión de facturas y cuentas por cobrar.</p>
                <button className="btn btn-primary">Acceder</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
