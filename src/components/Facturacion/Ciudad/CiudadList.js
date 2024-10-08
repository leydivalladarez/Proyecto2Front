import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../common/Layout';
import CiudadTable from './CiudadTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faSearch } from '@fortawesome/free-solid-svg-icons';

const CiudadList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = () => {
    navigate(`/facturacion/ciudades?search=${searchTerm}`);
  };

  return (
    <Layout onLogout={handleLogout}>
      <Row className='"mb-3'>
        <Col>
          <Form.Control
            type="text"
            placeholder="Buscar por Nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col className="d-flex justify-content-start">
          <Button variant="primary" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} /> Buscar
          </Button>
        </Col>
        <Col className='d-flex justify-content-end'>
          <Button variant="success" onClick={() => navigate('/facturacion/ciudades/agregar')}>
            <FontAwesomeIcon icon={faAdd} /> Agregar
          </Button>
        </Col>
      </Row>
      <CiudadTable searchTerm={searchTerm} />
    </Layout>
  );
};

export default CiudadList;
