import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import ClienteList from './Facturacion/Cliente/ClienteList';
import ClienteForm from './Facturacion/Cliente/ClienteForm';
import CiudadList from './Facturacion/Ciudad/CiudadList';
import CiudadForm from './Facturacion/Ciudad/CiudadForm';
import FacturaList from './Facturacion/Factura/FacturaList';
import FacturaForm from './Facturacion/Factura/FacturaForm';
import VentaCiudades from './Facturacion/Reportes/VentasCiudades';
import ClienteArticulo from './Facturacion/Reportes/ClienteArticulo';
import MotivoList from './Nomina/Motivo/MotivoList';
import MotivoForm from './Nomina/Motivo/MotivoForm';
import EmpleadoList from './Nomina/Empleado/EmpleadoList';
import EmpleadoForm from './Nomina/Empleado/EmpleadoForm';
import NominaList from './Nomina/Nomina/NominaList';
import NominaForm from './Nomina/Nomina/NominaForm';
import ValoresAPagar from './Nomina/Reportes/ValoresAPagar';
import MotivoEmpleado from './Nomina/Reportes/MotivoEmpleado';
import TipoActivoList from './Activo/TipoActivo/TipoActivoList';
import TipoActivoForm from './Activo/TipoActivo/TipoActivoForm';
import ActivoList from './Activo/Activo/ActivoList';
import ActivoForm from './Activo/Activo/ActivoForm';
import DepreciacionList from './Activo/Depreciacion/DepreciacionList';
import DepreciacionForm from './Activo/Depreciacion/DepreciacionForm';
import ReporteDepreciacion from './Activo/Reportes/ReporteDepreciacion';

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
      <Route path="/facturacion/clientes" element={<ClienteList />} />
      <Route path="/facturacion/clientes/agregar" element={<ClienteForm />} />
      <Route path="/facturacion/clientes/editar/:id" element={<ClienteForm />} />

      <Route path="/facturacion/ciudades" element={<CiudadList />} />
      <Route path="/facturacion/ciudades/agregar" element={<CiudadForm />} />
      <Route path="/facturacion/ciudades/editar/:codigo" element={<CiudadForm />} />

      <Route path="/facturacion/facturas" element={<FacturaList />} />
      <Route path="/facturacion/facturas/agregar" element={<FacturaForm />} />
      <Route path="/facturacion/facturas/editar/:id" element={<FacturaForm />} />

      <Route path="/facturacion/reportes/ventas-totales-ciudades" element={<VentaCiudades />} />
      <Route path="/facturacion/reportes/ventas-cruzadas" element={<ClienteArticulo />} />

      {/* Nómina */}
      <Route path="/nomina/motivos" element={<MotivoList />} />
      <Route path="/nomina/motivos/agregar" element={<MotivoForm />} />
      <Route path="/nomina/motivos/editar/:codigo" element={<MotivoForm />} />

      <Route path="/nomina/empleados" element={<EmpleadoList />} />
      <Route path="/nomina/empleados/agregar" element={<EmpleadoForm />} />
      <Route path="/nomina/empleados/editar/:id" element={<EmpleadoForm />} />

      <Route path="/nomina/nominas" element={<NominaList />} />
      <Route path="/nomina/nominas/agregar" element={<NominaForm />} />
      <Route path="/nomina/nominas/editar/:numero" element={<NominaForm />} />

      <Route path="/nomina/reportes/valores-a-pagar" element={<ValoresAPagar />} />
      <Route path="/nomina/reportes/nomina-cruzada" element={<MotivoEmpleado />} />

      {/* Activo */}
      <Route path="/activo/tipoActivos" element={<TipoActivoList />} />
      <Route path="/activo/tipoActivos/agregar" element={<TipoActivoForm />} />
      <Route path="/activo/tipoActivos/editar/:codigo" element={<TipoActivoForm />} />

      <Route path="/activo/activos" element={<ActivoList />} />
      <Route path="/activo/activos/agregar" element={<ActivoForm />} />
      <Route path="/activo/activos/editar/:id" element={<ActivoForm />} />

      <Route path="/activo/depreciaciones" element={<DepreciacionList />} />
      <Route path="/activo/depreciaciones/agregar" element={<DepreciacionForm />} />
      <Route path="/activo/depreciaciones/editar/:numero" element={<DepreciacionForm />} />

      <Route path="/activo/reportes/reporte-depreciacion" element={<ReporteDepreciacion />} />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
