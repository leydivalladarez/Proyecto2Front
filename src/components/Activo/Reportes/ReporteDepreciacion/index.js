import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../../common/Layout';
import { Button, Col, Row } from 'react-bootstrap';
import Table from './Table';
import CustomDatePicker from "../../../../common/Custom-Datepicker";

const ReporteDepreciacion = () => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false); // Estado para manejar la búsqueda
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = () => {
    setFetchTrigger(!fetchTrigger); // Cambia el estado para disparar la búsqueda
  };

  return (
    <Layout onLogout={handleLogout}>
      <Row>
        <Col>
          <CustomDatePicker 
            selected={fechaInicio} 
            onChange={date => setFechaInicio(date)} 
            placeholderText="Fecha Inicio" 
          />
        </Col>
        <Col>
          <CustomDatePicker 
            selected={fechaFin} 
            onChange={date => setFechaFin(date)} 
            placeholderText="Fecha Fin" 
          />
        </Col>
        <Col>
          <Button 
            onClick={handleSearch} 
            variant="primary"
          >
            Buscar
          </Button>
        </Col>
      </Row>
      <Table fechaInicio={fechaInicio} fechaFin={fechaFin} fetchTrigger={fetchTrigger} />
    </Layout>
  );
};

export default ReporteDepreciacion;
