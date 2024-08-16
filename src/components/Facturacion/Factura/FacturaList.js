import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../common/Layout';
import FacturaTable from './FacturaTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const FacturaList = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout onLogout={handleLogout}>
      <Row className=''>
        <Col className='d-flex justify-content-end'>
          <Button variant="success" onClick={() => navigate('/facturas/agregar')}>
            <FontAwesomeIcon icon={faAdd} /> Agregar
          </Button>
        </Col>
      </Row>
      <FacturaTable />
    </Layout>
  );
};

export default FacturaList;
