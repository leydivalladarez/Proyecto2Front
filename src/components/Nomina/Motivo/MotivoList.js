import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../../common/Layout';
import MotivoTable from './MotivoTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faSearch } from '@fortawesome/free-solid-svg-icons';

const MotivoList = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
    navigate(`/nomina/motivos?search=${searchTerm}`);
  };

  return (
    <Layout onLogout={handleLogout}>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Buscar por Nombre o Tipo"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              navigate(`/nomina/motivos?search=${e.target.value}`);
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
            onClick={() => navigate("/nomina/motivos/agregar")}
          >
            <FontAwesomeIcon icon={faAdd} /> Agregar
          </Button>
        </Col>
      </Row>
      <Row className=''>
        <Col className='d-flex justify-content-end'>
          <Button variant="success" onClick={() => navigate('/nomina/motivos/agregar')}>
            <FontAwesomeIcon icon={faAdd} /> Agregar
          </Button>
        </Col>
      </Row>
      <MotivoTable searchTerm={searchTerm} />
    </Layout>
  );
};

export default MotivoList;
