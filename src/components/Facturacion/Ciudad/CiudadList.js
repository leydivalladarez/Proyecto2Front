import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../common/Layout';
import CiudadTable from './CiudadTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const CiudadList = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout onLogout={handleLogout}>
      <Row className=''>
        <Col className='d-flex justify-content-end'>
          <Button variant="success" onClick={() => navigate('/facturacion/ciudades/agregar')}>
            <FontAwesomeIcon icon={faAdd} /> Agregar
          </Button>
        </Col>
      </Row>
      <CiudadTable />
    </Layout>
  );
};

export default CiudadList;
