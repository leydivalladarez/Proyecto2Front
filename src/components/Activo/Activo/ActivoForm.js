import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Layout from '../../../common/Layout';

const ActivoForm = () => {
  const [activo, setActivo] = useState({ nombre: '', periodosDepreciacionTotal: '', valorCompra: '', tipoActivo: '',});
  const [tipoActivos, setTipoActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Cargar la lista de Tipo de Activos
    setLoading(true);
    axios.get('http://localhost:8080/api/v1/tipoActivos')
     .then(response => {
        setTipoActivos(response.data);
        setLoading(false);
      })
     .catch(error => {
        setError(error);
        setLoading(false);
      });

    if (id) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/v1/activos/${id}`)
        .then(response => {
          setActivo(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    let valor = e.target.value;

    if(e.target.name === 'tipoActivo'){
      valor = {codigo: e.target.value};
    }

    setActivo({
      ...activo,
      [e.target.name]:valor
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const request = id 
      ? axios.put(`http://localhost:8080/api/v1/activos/${id}`, activo)
      : axios.post('http://localhost:8080/api/v1/activos', activo);

    request
      .then(() => {
        setLoading(false);
        navigate('/activo/activos');
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
            value={activo.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            required
          />
        </Form.Group>
        <Form.Group controlId="formPeriodoDepreciacion">
          <Form.Label>Periodo de Depreciación</Form.Label>
          <Form.Control 
            type="number" 
            name="periodosDepreciacionTotal"
            value={activo.periodosDepreciacionTotal}
            onChange={handleChange}
            placeholder="Ingrese el Periodo de Depreciacion"
            required
          />        
        </Form.Group>
        <Form.Group controlId="formValorCompra">
          <Form.Label>Valor de Compra</Form.Label>
          <Form.Control 
            type="text" 
            name="valorCompra"
            value={activo.valorCompra}
            onChange={handleChange}
            placeholder="Ingrese el valor de compra..."
            required
          />
        </Form.Group>
        <Form.Group controlId="formTipoActivo">
          <Form.Label>Tipo de Activo</Form.Label>
          <Form.Select
            className='text-capitalize'
            aria-label="Seleccionar Tipo de Activo"
            name="tipoActivo"
            value={activo.tipoActivo.codigo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione Tipo de Activo</option>
            {tipoActivos.map((tipo) => (
              <option key={tipo.codigo} value={tipo.codigo}>
                {tipo.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group> 
        <Button variant="primary" type="submit" className="mt-3">
          {id ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
    </Layout>
  );
};

export default ActivoForm;
