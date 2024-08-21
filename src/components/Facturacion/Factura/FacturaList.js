import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../../common/Layout';
import FacturaTable from './FacturaTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faSearch } from '@fortawesome/free-solid-svg-icons';

const FacturaList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchTerm(search);
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = () => {
    navigate(`/facturacion/facturas?search=${searchTerm}`);
  };

  return (
    <Layout onLogout={handleLogout}>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Buscar por ID o Nombre"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              navigate(`/facturacion/facturas?search=${e.target.value}`);
            }}
          />
        </Col>
        <Col className="d-flex justify-content-start">
          <Button variant="primary" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} /> Buscar
          </Button>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button
            variant="success"
            onClick={() => navigate("/facturacion/facturas/agregar")}
          >
            <FontAwesomeIcon icon={faAdd} /> Agregar
          </Button>
        </Col>
      </Row>
      <FacturaTable searchTerm={searchTerm} />
    </Layout>
  );
};

export default FacturaList;
