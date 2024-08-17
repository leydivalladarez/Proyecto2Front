import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../../common/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import Table from './Table';

const ClienteArticulo = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout onLogout={handleLogout}>
      <Table />
    </Layout>
  );
};

export default ClienteArticulo;
