import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import Layout from "../../../common/Layout";
import CustomDatePicker from "../../../common/Custom-Datepicker";
import ComprobanteContabilidadDetalle from "./ComprobanteContabilidadDetalle";

const ComprobanteContabilidadForm = () => {
  const [comprobanteContabilidad, setComprobanteContabilidad] = useState({
    numero: "",
    fecha: "",
    observaciones: "",
    comprobanteContabilidadDetalles: [],
  });
  const [cuadrado, setCuadrado] = useState(true); 
  const [showModal, setShowModal] = useState(false);
  const [tipoTransaccion, setTipoTransaccion] = useState('');
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
        .get(`http://localhost:8080/api/v1/comprobantesContabilidad/${numero}`)
        .then((response) => {
          const data = response.data;
          // Convertir la fecha de string a objeto Date
          if (data.fecha) {
            const dateObject = createLocalDate(data.fecha);
            setComprobanteContabilidad((prevComprobanteContabilidad) => ({
              ...prevComprobanteContabilidad,
              fecha: dateObject,
            }));
            setDatePick(dateObject);
          }
          if(data.comprobanteContabilidadDetalles.length > 0){
            const primer = data.comprobanteContabilidadDetalles[0];
            const tipoNombre = primer.cuenta.tipoCuenta.nombre.toLowerCase();
            if(tipoNombre === 'activo' || tipoNombre === 'pasivo' || tipoNombre.includes("patrimonio")){
              setTipoTransaccion('balance');
            } else {
              setTipoTransaccion('resultado');
            }
          }
          setComprobanteContabilidad(data);
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
    
    setComprobanteContabilidad({
      ...comprobanteContabilidad,
      [e.target.name]: valor,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que el cuadrado esté chequeado
    if (!cuadrado) {
      setShowModal(true); // Mostrar el modal si no está cuadrado
      return;
    }
    setLoading(true);

    // Convertir la fecha a 'YYYY-MM-DD'
    const comprobanteContabilidadData = { ...comprobanteContabilidad };
    if (datepick) {
      comprobanteContabilidadData.fecha = datepick.toISOString().split("T")[0];
    }    

    const request = numero
      ? axios.put(`http://localhost:8080/api/v1/comprobantesContabilidad/${numero}`, comprobanteContabilidadData)
      : axios.post("http://localhost:8080/api/v1/comprobantesContabilidad", comprobanteContabilidadData);

    request
      .then(() => {
        setLoading(false);
        navigate("/contabilidad/comprobantesContabilidad");
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
              <Form.Label>ComprobanteContabilidad Nro</Form.Label>
              <Form.Control
                type="text"
                name="nro"
                value={comprobanteContabilidad.numero}
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
                  setComprobanteContabilidad((prevComprobanteContabilidad) => ({
                    ...prevComprobanteContabilidad,
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
          <Col md={6}>
            <Form.Group controlId="formNombre">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                name="observaciones"
                value={comprobanteContabilidad.observaciones}
                onChange={handleChange}
                placeholder="Ingrese las observaciones"
              />
            </Form.Group>
          </Col>
          {/* <Col md={6}>
            <Form.Group controlId="formTipoTransaccion">
              <Form.Label>Tipo de Transacción</Form.Label>
              <Form.Control
                as="select"
                name="tipoTransaccion"
                value={tipoTransaccion}
                onChange={(e) => setTipoTransaccion(e.target.value)}
                required
                disabled={comprobanteContabilidad.comprobanteContabilidadDetalles.length > 0}
              >
                <option value="">Seleccione</option>
                <option value="balance">Operaciones del Balance</option>
                <option value="resultado">Operaciones del Resultado</option>
              </Form.Control>
            </Form.Group>
          </Col> */}
        </Row>

        <ComprobanteContabilidadDetalle
          comprobanteContabilidadDetalles={comprobanteContabilidad.comprobanteContabilidadDetalles}
          setComprobanteContabilidadDetalles={(detalles) =>
            setComprobanteContabilidad({ ...comprobanteContabilidad, comprobanteContabilidadDetalles: detalles })
          }
          setCuadrado={setCuadrado}
          tipoTransaccion={tipoTransaccion}
        />

        <Button variant="primary" type="submit" className="mt-3" disabled={!cuadrado}>
          {numero ? "Actualizar" : "Agregar"}
        </Button>
      </Form>

      {/* Modal de advertencia */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>Las sumas del Debe y el Haber no están cuadradas. Por favor, revisa los valores.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default ComprobanteContabilidadForm;
