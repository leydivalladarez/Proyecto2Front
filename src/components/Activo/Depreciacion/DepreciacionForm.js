import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import Layout from "../../../common/Layout";
import CustomDatePicker from "../../../common/Custom-Datepicker";
import DepreciacionDetalle from "./DepreciacionDetalle";

const DepreciacionForm = () => {
  const [depreciacion, setDepreciacion] = useState({
    fecha: "",
    observaciones: "",
    responsable: "",
  });
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

    if (numero) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/v1/depreciaciones/${numero}`)
        .then((response) => {
          const data = response.data;
          // Convertir la fecha de string a objeto Date
          if (data.fecha) {
            const dateObject = createLocalDate(data.fecha);
            setDepreciacion((prevDepreciacion) => ({
              ...prevDepreciacion,
              fecha: dateObject,
            }));
            setDatePick(dateObject);
          }

          setDepreciacion(data);
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
    setDepreciacion({
      ...depreciacion,
      [e.target.name]: valor,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Convertir la fecha a 'YYYY-MM-DD'
    const depreciacionData = { ...depreciacion };
    if (datepick) {
      depreciacionData.fecha = datepick.toISOString().split("T")[0];
    }    

    const request = numero
      ? axios.put(`http://localhost:8080/api/v1/depreciaciones/${numero}`, depreciacionData)
      : axios.post("http://localhost:8080/api/v1/depreciaciones", depreciacionData);

    request
      .then(() => {
        setLoading(false);
        navigate("/activo/depreciaciones");
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
              <Form.Label>Depreciacion Nro</Form.Label>
              <Form.Control
                type="text"
                name="nro"
                value={depreciacion.numero ? depreciacion.numero : ""}
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
                  setDepreciacion((prevDepreciacion) => ({
                    ...prevDepreciacion,
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
            <Form.Group controlId="formObservaciones">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control 
                as="textarea" 
                name="observaciones"
                value={depreciacion.observaciones}
                onChange={handleChange}
                placeholder="Ingrese observaciones"
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDireccion">
              <Form.Label>Responsable</Form.Label>
              <Form.Control 
                type="text" 
                name="responsable"
                value={depreciacion.responsable}
                onChange={handleChange}
                placeholder="Ingrese responsable"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <DepreciacionDetalle
          depreciacionDetalles={depreciacion.depreciacionDetalles}
          setDepreciacionDetalles={(detalles) =>
            setDepreciacion({ ...depreciacion, depreciacionDetalles: detalles })
          }
        />

        <Button variant="primary" type="submit" className="mt-3">
          {numero ? "Actualizar" : "Agregar"}
        </Button>
      </Form>
    </Layout>
  );
};

export default DepreciacionForm;
