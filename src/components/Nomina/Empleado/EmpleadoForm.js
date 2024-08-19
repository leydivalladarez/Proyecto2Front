import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import Layout from '../../../common/Layout';
import CustomDatePicker from '../../../common/Custom-Datepicker';

const EmpleadoForm = () => {
  const [empleado, setEmpleado] = useState({ cedula: '', nombre: '', fechaIngreso: '', sueldo : ''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [datepick, setDatePick] = useState(new Date());
  const navigate = useNavigate();
  const { id } = useParams();

  // Función para crear una fecha local sin ajustar la zona horaria
  const createLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Restar 1 al mes porque los meses en JavaScript van de 0 (enero) a 11 (diciembre)
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/v1/empleados/${id}`)
        .then(response => {
          const data = response.data;
          setEmpleado(data);

          // Convertir la fecha de string a objeto Date
          if (data.fechaIngreso) {
            const dateObject = createLocalDate(data.fechaIngreso);
            setEmpleado((prevEmpleado) => ({
              ...prevEmpleado,
              fechaIngreso: dateObject,
            }));
            setDatePick(dateObject);
          }
          
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setEmpleado({
      ...empleado,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Convertir la fecha a 'YYYY-MM-DD'
    const empleadoData = { ...empleado };
    if (datepick) {
      empleadoData.fechaIngreso = datepick.toISOString().split("T")[0];
    }

    const request = id 
      ? axios.put(`http://localhost:8080/api/v1/empleados/${id}`, empleadoData)
      : axios.post('http://localhost:8080/api/v1/empleados', empleadoData);

    request
      .then(() => {
        setLoading(false);
        navigate('/nomina/empleados');
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
        <Row>
        <Col>
        <Form.Group controlId="formRUC">
          <Form.Label>Cédula</Form.Label>
          <Form.Control 
            type="text" 
            name="cedula"
            maxLength={10}
            minLength={10}
            value={empleado.cedula}
            onChange={(e) => {
              const value = e.target.value;
              // Solo permitir que se ingresen números
              if (/^\d*$/.test(value)) {
                handleChange(e); // Mantener el cambio si es un número válido
              }
            }}
            placeholder="Ingrese el número de cédula..."
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
            value={empleado.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            required
          />
        </Form.Group>
        </Col>
        </Row>
        <Row>
          <Col>
        <Form.Group controlId="formDatePicker">
          <Form.Label>Fecha Ingreso</Form.Label>
          <CustomDatePicker
            wrapperClassName="datepicker"
            className="form-control"
            dateFormat="dd/MM/yyyy"
            selected={datepick}
            onChange={(date) => {
              setDatePick(date);
              setEmpleado((prevEmpleado) => ({
                ...prevEmpleado,
                fechaIngreso: date,
              }));
            }}
            placeholderText="Seleccione la fecha de ingreso"
            required
          />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="formDireccion">
          <Form.Label>Sueldo</Form.Label>
          <Form.Control 
            type="number" 
            name="sueldo"
            step="0.01"
            min="0"
            value={empleado.sueldo}
            onChange={handleChange}
            placeholder="Ingrese el sueldo"
            required
          />
        </Form.Group>
        </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3">
          {id ? 'Actualizar' : 'Agregar'}
        </Button>
      </Form>
    </Layout>
  );
};

export default EmpleadoForm;
