import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import Layout from "../../../common/Layout";

const CuentaForm = () => {
  const [cuenta, setCuenta] = useState({
    codigo: "",
    nombre: "",
    tipoCuenta: "",
  });
  const [tipoCuentas, setTipoCuentas] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { codigo } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/tipoCuentas")
      .then((response) => {
        setTipoCuentas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

    axios
      .get("http://localhost:8080/api/v1/cuentas")
      .then((response) => {
          setCuentas(response.data);
          setLoading(false);
        })
      .catch((error) => {
          setError(error);
          setLoading(false);
      });

    if (codigo) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/v1/cuentas/${codigo}`)
        .then((response) => {
          setCuenta(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [codigo]);

  const handleChange = (e) => {
    let valor = e.target.value;
    if(e.target.name === 'cuentaPadre' || e.target.name === 'tipoCuenta'){
      valor = {codigo: e.target.value};
    }

    setCuenta({
      ...cuenta,
      [e.target.name]: valor,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const request = codigo
      ? axios.put(`http://localhost:8080/api/v1/cuentas/${codigo}`, cuenta)
      : axios.post("http://localhost:8080/api/v1/cuentas", cuenta);

    request
      .then(() => {
        setLoading(false);
        navigate("/contabilidad/cuentas");
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  return (
    <Layout
      onLogout={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={cuenta.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formTipoCuenta">
              <Form.Label>Tipo de Cuenta</Form.Label>
              <Form.Select
                className="text-capitalize"
                aria-label="Seleccionar Tipo de Activo"
                name="tipoCuenta"
                value={cuenta.tipoCuenta.codigo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione Tipo de Cuenta</option>
                {tipoCuentas.map((tipo) => (
                  <option key={tipo.codigo} value={tipo.codigo}>
                    {tipo.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formCuentaPadre">
              <Form.Label>Cuenta Padre (Opcional)</Form.Label>
              <Form.Select
                className="text-capitalize"
                aria-label="Seleccionar Cuenta Padre"
                name="cuentaPadre"
                value={cuenta.cuentaPadre ? cuenta.cuentaPadre.codigo : ''}
                onChange={handleChange}                
              >
                <option value="">Seleccione Tipo de Cuenta</option>
                {cuentas.map((cuentaPadre) => (
                  <option key={cuentaPadre.codigo} value={cuentaPadre.codigo}>
                    {cuentaPadre.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3">
          {codigo ? "Actualizar" : "Agregar"}
        </Button>
      </Form>
    </Layout>
  );
};

export default CuentaForm;
