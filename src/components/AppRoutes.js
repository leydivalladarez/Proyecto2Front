import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import ClienteTable from './Cliente/ClienteTable';
import ClienteList from './Cliente/ClienteList';
import ClienteForm from './Cliente/ClienteForm';
import CiudadList from './Ciudad/CiudadList';
import CiudadForm from './Ciudad/CiudadForm';
import FacturaList from './Factura/FacturaList';
import FacturaForm from './Factura/FacturaForm';

const AppRoutes = ({ isAuthenticated }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      /> */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
      {/* <Route
        path="/clientes"
        element={isAuthenticated ? <ClienteTable /> : <Navigate to="/login" />}
      /> */}
      <Route path="/clientes" element={<ClienteList />} />
      <Route path="/clientes/agregar" element={<ClienteForm />} />
      <Route path="/clientes/editar/:id" element={<ClienteForm />} />

      <Route path="/ciudades" element={<CiudadList />} />
      <Route path="/ciudades/agregar" element={<CiudadForm />} />
      <Route path="/ciudades/editar/:codigo" element={<CiudadForm />} />

      <Route path="/facturas" element={<FacturaList />} />
      <Route path="/facturas/agregar" element={<FacturaForm />} />
      <Route path="/facturas/editar/:id" element={<FacturaForm />} />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
