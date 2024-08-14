import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import Layout from '../../common/Layout';

const FacturaForm = () => {
  const [factura, setFactura] = useState({ fecha: '', nombre: '', direccion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [datepick, setDatePick] = useState(new Date());
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/v1/facturas/${id}`)
        .then(response => {
          setFactura(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFactura({
      ...factura,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const request = id 
      ? axios.put(`http://localhost:8080/api/v1/facturas/${id}`, factura)
      : axios.post('http://localhost:8080/api/v1/facturas', factura);

    request
      .then(() => {
        setLoading(false);
        navigate('/facturas');
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  return (
    <Layout onLogout={() => {
      localStorage.removeItem('token');
      navigate('/login');
    }}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="formFecha">
              <Form.Label>Fecha</Form.Label>
              <Form.Control 
                type="text" 
                name="fecha"
                value={factura.fecha}
                onChange={handleChange}
                placeholder="Ingrese la fecha"
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                name="nombre"
                value={factura.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formDireccion">
          <Form.Label>Dirección</Form.Label>
          <Form.Control 
            type="text" 
            name="direccion"
            value={factura.direccion}
            onChange={handleChange}
            placeholder="Ingrese la dirección"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          {id ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
    </Layout>
  );
};

export default FacturaForm;
