import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Layout from '../../../common/Layout';

const MotivoForm = () => {
  const [motivo, setMotivo] = useState({ codigo: '', nombre: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { codigo } = useParams();
  const tipos = ['ingreso', 'egreso'];

  useEffect(() => {
    if (codigo) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/v1/motivos/${codigo}`)
        .then(response => {
          setMotivo(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [codigo]);

  const handleChange = (e) => {
    setMotivo({
      ...motivo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const request = codigo 
      ? axios.put(`http://localhost:8080/api/v1/motivos/${codigo}`, motivo)
      : axios.post('http://localhost:8080/api/v1/motivos', motivo);

    request
      .then(() => {
        setLoading(false);
        navigate('/nomina/motivos');
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error al cargar los datos: {error.message}</p>;
  }

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
            value={motivo.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            required
          />
        </Form.Group>  
        <Form.Group controlId="formTipo">
          <Form.Label>Tipo</Form.Label>
          <Form.Select
            className='text-capitalize'
            aria-label="Seleccionar Tipo"
            name="tipo"
            value={motivo.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione Tipo</option>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </Form.Select>
        </Form.Group>        
        <Button variant="primary" type="submit" className="mt-3">
          {codigo ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
    </Layout>
  );
};

export default MotivoForm;
