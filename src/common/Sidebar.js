import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import { Button } from "react-bootstrap";

const Sidebar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    // Detectar qué submenú debe estar abierto basado en la ruta actual
    const path = location.pathname;
    if (path.startsWith("/nomina")) {
      setActiveMenu("nomina-collapse");
      if (path.startsWith("/nomina/reportes")) {
        setActiveMenu("nomina-report-collapse");
      }
    } else if (path.startsWith("/activo")) {
      setActiveMenu("activos-collapse");
      if (path.startsWith("/activo/reportes")) {
        setActiveMenu("activos-report-collapse");
      }
    } else if (
      path.startsWith("/new") ||
      path.startsWith("/processed") ||
      path.startsWith("/shipped")
    ) {
      setActiveMenu("orders-collapse");
    } else if (path.startsWith("/facturacion")) {
      setActiveMenu("invoices-collapse");
      if (path.startsWith("/facturacion/reportes")) {
        setActiveMenu("invoices-report-collapse");
      }
    } else if (path.startsWith("/contabilidad")) {
      setActiveMenu("contabilidad-collapse");
      if (path.startsWith("/contabilidad/reportes")) {
        setActiveMenu("contabilidad-report-collapse");
      }
    } else if (path.startsWith("/profile") || path.startsWith("/settings")) {
      setActiveMenu("account-collapse");
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
          <button
            className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${
              activeMenu && activeMenu.startsWith("invoices-")
                ? ""
                : "collapsed"
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#invoices-collapse"
            aria-expanded={activeMenu && activeMenu.startsWith("invoices-")}
          >
            Facturación
          </button>
          <div
            className={`collapse ${
              activeMenu && activeMenu.startsWith("invoices-") ? "show" : ""
            }`}
            id="invoices-collapse"
          >
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <NavLink
                  to="/facturacion/clientes"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Clientes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/facturacion/ciudades"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Ciudades
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/facturacion/facturas"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Facturas
                </NavLink>
              </li>
              <li className="mb-1 ms-3">
                <button
                  className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${
                    activeMenu === "invoices-report-collapse" ? "" : "collapsed"
                  }`}
                  data-bs-toggle="collapse"
                  data-bs-target="#invoices-report-collapse"
                  aria-expanded={activeMenu === "invoices-report-collapse"}
                >
                  Reportes
                </button>
                <div
                  className={`collapse ${
                    activeMenu === "invoices-report-collapse" ? "show" : ""
                  }`}
                  id="invoices-report-collapse"
                >
                  <li>
                    <NavLink
                      to="/facturacion/reportes/ventas-totales-ciudades"
                      className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                    >
                      Ventas Totales por Ciudad
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/facturacion/reportes/ventas-cruzadas"
                      className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                    >
                      Ventas Cruzadas
                    </NavLink>
                  </li>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className="mb-1">
          <button
            className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${
              activeMenu && activeMenu.startsWith("nomina-") ? "" : "collapsed"
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#nomina-collapse"
            aria-expanded={activeMenu && activeMenu.startsWith("nomina-")}
          >
            Nómina
          </button>
          <div
            className={`collapse ${
              activeMenu && activeMenu.startsWith("nomina-") ? "show" : ""
            }`}
            id="nomina-collapse"
          >
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <NavLink
                  to="/nomina/motivos"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Motivos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/nomina/empleados"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Empleados
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/nomina/nominas"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Nominas
                </NavLink>
              </li>
              <li className="mb-1 ms-3">
                <button
                  className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${
                    activeMenu === "nomina-report-collapse" ? "" : "collapsed"
                  }`}
                  data-bs-toggle="collapse"
                  data-bs-target="#nomina-report-collapse"
                  aria-expanded={activeMenu === "nomina-report-collapse"}
                >
                  Reportes
                </button>
                <div
                  className={`collapse ${
                    activeMenu === "nomina-report-collapse" ? "show" : ""
                  }`}
                  id="nomina-report-collapse"
                >
                  <li>
                    <NavLink
                      to="/nomina/reportes/valores-a-pagar"
                      className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                    >
                      Valores a Pagar
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/nomina/reportes/nomina-cruzada"
                      className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                    >
                      Nómina Cruzada
                    </NavLink>
                  </li>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className="mb-1">
          <button
            className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${
              activeMenu && activeMenu.startsWith("activos-") ? "" : "collapsed"
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#activos-collapse"
            aria-expanded={activeMenu && activeMenu.startsWith("activos-")}
          >
            Activos
          </button>
          <div
            className={`collapse ${
              activeMenu && activeMenu.startsWith("activos-") ? "show" : ""
            }`}
            id="activos-collapse"
          >
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <NavLink
                  to="/activo/tipoActivos"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Tipo Activos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/activo/activos"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Activos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/activo/depreciaciones"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Depreciaciones
                </NavLink>
              </li>
              <li className="mb-1 ms-3">
                <button
                  className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${
                    activeMenu === "activos-report-collapse" ? "" : "collapsed"
                  }`}
                  data-bs-toggle="collapse"
                  data-bs-target="#activos-report-collapse"
                  aria-expanded={activeMenu === "activos-report-collapse"}
                >
                  Reportes
                </button>
                <div
                  className={`collapse ${
                    activeMenu === "activos-report-collapse" ? "show" : ""
                  }`}
                  id="activos-report-collapse"
                >
                  <li>
                    <NavLink
                      to="/activo/reportes/reporte-depreciacion"
                      className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                    >
                      Reporte Depreciación
                    </NavLink>
                  </li>
                  {/* <li><NavLink to="/activo/reportes/def" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Nómina Cruzada</NavLink></li> */}
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className="mb-1">
          <button
            className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${
              activeMenu && activeMenu.startsWith("contabilidad-") ? "" : "collapsed"
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#contabilidad-collapse"
            aria-expanded={activeMenu && activeMenu.startsWith("contabilidad-")}
          >
            Contabilidad
          </button>
          <div
            className={`collapse ${
              activeMenu && activeMenu.startsWith("contabilidad-") ? "show" : ""
            }`}
            id="contabilidad-collapse"
          >
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <NavLink
                  to="/contabilidad/tipoCuentas"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Tipo de Cuentas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contabilidad/cuentas"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Cuentas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contabilidad/comprobantesContabilidad"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Comprobantes
                </NavLink>
              </li>
              <li className="mb-1 ms-3">
                <button
                  className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${
                    activeMenu === "contabilidad-report-collapse" ? "" : "collapsed"
                  }`}
                  data-bs-toggle="collapse"
                  data-bs-target="#contabilidad-report-collapse"
                  aria-expanded={activeMenu === "contabilidad-report-collapse"}
                >
                  Reportes
                </button>
                <div
                  className={`collapse ${
                    activeMenu === "contabilidad-report-collapse" ? "show" : ""
                  }`}
                  id="contabilidad-report-collapse"
                >
                  <li>
                    <NavLink
                      to="/contabilidad/reportes/balance-general"
                      className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                    >
                      Balance General
                    </NavLink>
                  </li>
                  <li><NavLink to="/contabilidad/reportes/estado-resultados" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Estado Resultados</NavLink></li>
                </div>
              </li>
            </ul>
          </div>
        </li>
        
        <li className="border-top my-3"></li>
        <li className="mb-1">
          <button
            className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 ${
              activeMenu === "account-collapse" ? "" : "collapsed"
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#account-collapse"
            aria-expanded={activeMenu === "account-collapse"}
          >
            Cuenta
          </button>
          <div
            className={`collapse ${
              activeMenu === "account-collapse" ? "show" : ""
            }`}
            id="account-collapse"
          >
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              {/* <li>
                <NavLink
                  to="/new"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  New...
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Settings
                </NavLink>
              </li> */}
              <li>
                <Button
                  onClick={handleLogout}
                  variant="link"
                  className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                >
                  Cerrar Sesión
                </Button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
