import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../common/Layout';
import TipoCuentaTable from './TipoCuentaTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faSearch } from '@fortawesome/free-solid-svg-icons';

const TipoCuentaList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = () => {
    navigate(`/contabilidad/tipoCuentas?search=${searchTerm}`);
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
          <Button variant="success" onClick={() => navigate('/contabilidad/tipoCuentas/agregar')}>
            <FontAwesomeIcon icon={faAdd} /> Agregar
          </Button>
        </Col>
      </Row>
      <TipoCuentaTable searchTerm={searchTerm} />
    </Layout>
  );
};

export default TipoCuentaList;
