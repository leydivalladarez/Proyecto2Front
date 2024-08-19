import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import Layout from "../../../common/Layout";
import CustomDatePicker from "../../../common/Custom-Datepicker";
import NominaDetalle from "./NominaDetalle";

const NominaForm = () => {
  const [nomina, setNomina] = useState({
    fecha: "",
    empleado: "",
    motivo: "",
  });
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [datepick, setDatePick] = useState(new Date());
  const navigate = useNavigate();
  const { numero } = useParams();

  // Función para crear una fecha local sin ajustar la zona horaria
  const createLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Restar 1 al mes porque los meses en JavaScript van de 0 (enero) a 11 (diciembre)
  };

  useEffect(() => {
    // Cargar la lista de empleados
    axios
      .get("http://localhost:8080/api/v1/empleados")
      .then((response) => {
        setEmpleados(response.data);
      })
      .catch((error) => {
        setError(error);
      });

    if (numero) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/v1/nominas/${numero}`)
        .then((response) => {
          const data = response.data;
          
          // Convertir la fecha de string a objeto Date
          if (data.fecha) {
            const dateObject = createLocalDate(data.fecha);
            setNomina((prevNomina) => ({
              ...prevNomina,
              fecha: dateObject,
            }));
            setDatePick(dateObject);
          }

          setNomina(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [numero]);

  const handleChange = (e) => {
    let valor = e.target.value;
    if(e.target.name === 'motivo'){
      valor = {codigo: e.target.value};
    }else if( e.target.name === 'empleado' ){
      valor = {id: e.target.value};
    }
    
    setNomina({
      ...nomina,
      [e.target.name]: valor,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Convertir la fecha a 'YYYY-MM-DD'
    const nominaData = { ...nomina };
    if (datepick) {
      nominaData.fecha = datepick.toISOString().split("T")[0];
    }
    console.log(nominaData);
    

    const request = numero
      ? axios.put(`http://localhost:8080/api/v1/nominas/${numero}`, nominaData)
      : axios.post("http://localhost:8080/api/v1/nominas", nominaData);

    request
      .then(() => {
        setLoading(false);
        navigate("/nomina/nominas");
      })
      .catch((error) => {
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
    <Layout
      onLogout={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="formId">
              <Form.Label>Nomina Nro</Form.Label>
              <Form.Control
                type="text"
                name="nro"
                value={nomina.numero}
                // onChange={handleChange}
                placeholder="Generado automáticamente al crear"
                readOnly
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDatePicker">
              <Form.Label>Fecha</Form.Label>
              <CustomDatePicker
                wrapperClassName="datepicker"
                className="form-control"
                dateFormat="dd/MM/yyyy"
                selected={datepick}
                onChange={(date) => {
                  setDatePick(date);
                  setNomina((prevNomina) => ({
                    ...prevNomina,
                    fecha: date,
                  }));
                }}
                placeholderText="Seleccione la fecha"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="formNombre">
              <Form.Label>Empleado</Form.Label>
              <Form.Select
                aria-label="Seleccionar Empleado"
                name="empleado"
                value={nomina.empleado.id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>          
        </Row>

        <NominaDetalle
          nominaDetalles={nomina.nominaDetalles}
          setNominaDetalles={(detalles) =>
            setNomina({ ...nomina, nominaDetalles: detalles })
          }
        />

        <Button variant="primary" type="submit" className="mt-3">
          {numero ? "Actualizar" : "Agregar"}
        </Button>
      </Form>
    </Layout>
  );
};

export default NominaForm;
