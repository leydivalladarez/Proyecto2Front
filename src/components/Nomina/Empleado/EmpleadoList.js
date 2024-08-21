import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../../common/Layout';
import Table from './Table';
import { Button, Col, Row, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faSearch } from '@fortawesome/free-solid-svg-icons';

const EmpleadoList = () => {
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
    navigate(`/nomina/empleados?search=${searchTerm}`);
  };

  return (
    <Layout onLogout={handleLogout}>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Buscar por Cédula o Nombre"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              navigate(`/nomina/empleados?search=${e.target.value}`);
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
            onClick={() => navigate("/nomina/empleados/agregar")}
          >
            <FontAwesomeIcon icon={faAdd} /> Agregar
          </Button>
        </Col>
      </Row>
      <Table searchTerm={searchTerm} />
    </Layout>
  );
};

export default EmpleadoList;
