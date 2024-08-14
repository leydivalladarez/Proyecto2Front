import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Layout from '../../common/Layout';

const ClienteForm = () => {
  const [cliente, setCliente] = useState({ ruc: '', nombre: '', direccion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/v1/clientes/${id}`)
        .then(response => {
          setCliente(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const request = id 
      ? axios.put(`http://localhost:8080/api/v1/clientes/${id}`, cliente)
      : axios.post('http://localhost:8080/api/v1/clientes', cliente);

    request
      .then(() => {
        setLoading(false);
        navigate('/clientes');
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
        <Form.Group controlId="formRUC">
          <Form.Label>RUC</Form.Label>
          <Form.Control 
            type="text" 
            name="ruc"
            value={cliente.ruc}
            onChange={handleChange}
            placeholder="Ingrese el RUC"
            required
          />
        </Form.Group>
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control 
            type="text" 
            name="nombre"
            value={cliente.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            required
          />
        </Form.Group>
        <Form.Group controlId="formDireccion">
          <Form.Label>Dirección</Form.Label>
          <Form.Control 
            type="text" 
            name="direccion"
            value={cliente.direccion}
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

export default ClienteForm;
