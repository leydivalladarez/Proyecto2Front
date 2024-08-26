import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'; // Importa el archivo CSS para Header
import { Toggle } from './ToggleTheme';


const Header = ({ onLogout }) => {
  return (
    <header className="navbar navbar-expand-lg ">
      <a className="navbar-brand" href="/dashboard">Contabilidad Dashboard</a>
      <Toggle />
      <button onClick={onLogout} className="btn btn-danger ms-auto">Cerrar Sesión</button>
    </header>
  );
};

export default Header;
