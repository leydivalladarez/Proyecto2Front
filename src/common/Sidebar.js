import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css'; 

const Sidebar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    // Detectar qué submenú debe estar abierto basado en la ruta actual
    const path = location.pathname;
    if (path.startsWith('/nomina')) {
      setActiveMenu('nomina-collapse');
    } else if (path.startsWith('/weekly') || path.startsWith('/monthly') || path.startsWith('/annually')) {
      setActiveMenu('dashboard-collapse');
    } else if (path.startsWith('/new') || path.startsWith('/processed') || path.startsWith('/shipped')) {
      setActiveMenu('orders-collapse');
    } else if (path.startsWith('/facturacion')) {
      setActiveMenu('invoices-collapse');
      if(path.startsWith('/facturacion/reportes')){
        // setActiveMenu('invoices-collapse');
        setActiveMenu('invoices-report-collapse');
      }
    } else if (path.startsWith('/profile') || path.startsWith('/settings')) {
      setActiveMenu('account-collapse');
    } else {
      setActiveMenu(null);
    }
  }, [location]);

  
      return (
        <div className="flex-shrink-0 p-3 border-right" style={{ width: "280px" }}>
          {/* <a href="/" className="d-flex align-items-center pb-3 mb-3 link-body-emphasis text-decoration-none border-bottom">
        <svg className="bi pe-none me-2" width="30" height="24">
          <use xlinkHref="#bootstrap" />
        </svg>
        <span className="fs-5 fw-semibold">Collapsible</span>
      </a> */}
          <ul className="list-unstyled ps-0">
            <li className="mb-1">
              <button className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${activeMenu === 'nomina-collapse' ? '' : 'collapsed'}`} data-bs-toggle="collapse" data-bs-target="#nomina-collapse" aria-expanded={activeMenu === 'nomina-collapse'}>
                Nómina
              </button>
              <div className={`collapse ${activeMenu === 'nomina-collapse' ? 'show' : ''}`} id="nomina-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li><NavLink to="/nomina/motivos" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Motivos</NavLink></li>
                  <li><NavLink to="/nomina/empleados" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Empleados</NavLink></li>
                  <li><NavLink to="/reports" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Reports</NavLink></li>
                </ul>
              </div>
            </li>
            <li className="mb-1">
              <button className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${activeMenu === 'dashboard-collapse' ? '' : 'collapsed'}`} data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded={activeMenu === 'dashboard-collapse'}>
                Activos
              </button>
              <div className={`collapse ${activeMenu === 'dashboard-collapse' ? 'show' : ''}`} id="dashboard-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li><NavLink to="/overview" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Overview</NavLink></li>
                  <li><NavLink to="/weekly" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Weekly</NavLink></li>
                  <li><NavLink to="/monthly" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Monthly</NavLink></li>
                  <li><NavLink to="/annually" className="link-body-e  mphasis d-inline-flex text-decoration-none rounded">Annually</NavLink></li>
                </ul>
              </div>
            </li>
            <li className="mb-1">
              <button className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${activeMenu === 'orders-collapse' ? '' : 'collapsed'}`} data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded={activeMenu === 'orders-collapse'}>
                Contabilidad
              </button>
              <div className={`collapse ${activeMenu === 'orders-collapse' ? 'show' : ''}`} id="orders-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li><NavLink to="/new" className="link-body-emphasis d-inline-flex text-decoration-none rounded">New</NavLink></li>
                  <li><NavLink to="/processed" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Processed</NavLink></li>
                  <li><NavLink to="/shipped" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Shipped</NavLink></li>
                  <li><NavLink to="/returned" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Returned</NavLink></li>
                </ul>
              </div>
            </li>
            <li className="mb-1">
              <button className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${activeMenu && activeMenu.startsWith('invoices-') ? '' : 'collapsed'}`} data-bs-toggle="collapse" data-bs-target="#invoices-collapse" aria-expanded={activeMenu && activeMenu.startsWith('invoices-')}>
                Facturación
              </button>
              <div className={`collapse ${activeMenu && activeMenu.startsWith('invoices-') ? 'show' : ''}`} id="invoices-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li><NavLink to="/facturacion/clientes" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Clientes</NavLink></li>
                  <li><NavLink to="/facturacion/ciudades" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Ciudades</NavLink></li>
                  <li><NavLink to="/facturacion/facturas" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Facturas</NavLink></li>
                  <li className="mb-1 ms-3">
                    <button className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${activeMenu === 'invoices-report-collapse' ? '' : 'collapsed'}`} data-bs-toggle="collapse" data-bs-target="#invoices-report-collapse" aria-expanded={activeMenu === 'invoices-report-collapse'}>
                      Reportes
                    </button>
                    <div className={`collapse ${activeMenu === 'invoices-report-collapse' ? 'show' : ''}`} id="invoices-report-collapse">
                      <li><NavLink to="/facturacion/reportes/ventas-totales-ciudades" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Ventas Totales por Ciudad</NavLink></li>
                      <li><NavLink to="/facturacion/reportes/ventas-cruzadas" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Ventas Cruzadas</NavLink></li>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className="border-top my-3"></li>
            <li className="mb-1">
              <button className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${activeMenu === 'account-collapse' ? '' : 'collapsed'}`} data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded={activeMenu === 'account-collapse'}>
                Account
              </button>
              <div className={`collapse ${activeMenu === 'account-collapse' ? 'show' : ''}`} id="account-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li><NavLink to="/new" className="link-body-emphasis d-inline-flex text-decoration-none rounded">New...</NavLink></li>
                  <li><NavLink to="/profile" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Profile</NavLink></li>
                  <li><NavLink to="/settings" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Settings</NavLink></li>
                  <li><NavLink to="/sign-out" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Sign out</NavLink></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      );
    };
    
    export default Sidebar;