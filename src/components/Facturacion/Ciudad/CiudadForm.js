import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Layout from '../../../common/Layout';

const CiudadForm = () => {
  const [ciudad, setCiudad] = useState({ codigo: '', nombre: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { codigo } = useParams();

  useEffect(() => {
    if (codigo) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/v1/ciudades/${codigo}`)
        .then(response => {
          setCiudad(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [codigo]);

  const handleChange = (e) => {
    setCiudad({
      ...ciudad,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const request = codigo 
      ? axios.put(`http://localhost:8080/api/v1/ciudades/${codigo}`, ciudad)
      : axios.post('http://localhost:8080/api/v1/ciudades', ciudad);

    request
      .then(() => {
        setLoading(false);
        navigate('/facturacion/ciudades');
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
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control 
            type="text" 
            name="nombre"
            value={ciudad.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            required
          />
        </Form.Group>        
        <Button variant="primary" type="submit" className="mt-3">
          {codigo ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
    </Layout>
  );
};

export default CiudadForm;
