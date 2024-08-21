import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import Layout from "../../../common/Layout";
import CustomDatePicker from "../../../common/Custom-Datepicker";
import FacturaDetalle from "./FacturaDetalle";

const FacturaForm = () => {
  const [factura, setFactura] = useState({
    fecha: "",
    cliente: "",
    ciudad: "",
    facturaDetalles: [],
  });
  const [clientes, setClientes] = useState([]);
  const [ciudades, setCiudades] = useState([]);
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
    // Cargar la lista de clientes
    axios
      .get("http://localhost:8080/api/v1/clientes")
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        setError(error);
      });

    // Cargar la lista de ciudades
    axios
      .get("http://localhost:8080/api/v1/ciudades")
      .then((response) => {
        setCiudades(response.data);
      })
      .catch((error) => {
        setError(error);
      });

    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/v1/facturas/${id}`)
        .then((response) => {
          const data = response.data;
          // Convertir la fecha de string a objeto Date
          if (data.fecha) {
            const dateObject = createLocalDate(data.fecha);
            setFactura((prevFactura) => ({
              ...prevFactura,
              fecha: dateObject,
            }));
            setDatePick(dateObject);
          }

          //Agregar precioTotal a cada detalle
          data.facturaDetalles.forEach((detalle, i) => {
            detalle.precioTotal = detalle.cantidad * detalle.precio;
            data.facturaDetalles[i] = detalle;            
          });
          console.table(data.facturaDetalles);
          setFactura(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    let valor = e.target.value;
    if(e.target.name === 'ciudad'){
      valor = {codigo: e.target.value};
    }else if( e.target.name === 'cliente' ){
      valor = {id: e.target.value};
    }
    
    setFactura({
      ...factura,
      [e.target.name]: valor,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Convertir la fecha a 'YYYY-MM-DD'
    const facturaData = { ...factura };
    if (datepick) {
      facturaData.fecha = datepick.toISOString().split("T")[0];
    }
    console.log(facturaData);
    

    const request = id
      ? axios.put(`http://localhost:8080/api/v1/facturas/${id}`, facturaData)
      : axios.post("http://localhost:8080/api/v1/facturas", facturaData);

    request
      .then(() => {
        setLoading(false);
        navigate("/facturacion/facturas");
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const formatInvoiceNumber = (id) => {
    // Ajusta el número de dígitos que deseas mostrar para el número de factura
    const paddedId = String(id).padStart(9, "0");
    return `001-001-${paddedId}`;
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
          <Col>
            <Form.Group controlId="formId">
              <Form.Label>Factura Nro</Form.Label>
              <Form.Control
                type="text"
                name="nro"
                value={factura.id ? formatInvoiceNumber(factura.id) : ""}
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
                  setFactura((prevFactura) => ({
                    ...prevFactura,
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
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                aria-label="Seleccionar Cliente"
                name="cliente"
                value={factura.cliente.id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDireccion">
              <Form.Label>Ciudad</Form.Label>
              <Form.Select
                aria-label="Seleccionar Ciudad"
                name="ciudad"
                value={factura.ciudad.codigo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una ciudad</option>
                {ciudades.map((ciudad) => (
                  <option key={ciudad.codigo} value={ciudad.codigo}>
                    {ciudad.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <FacturaDetalle
          facturaDetalles={factura.facturaDetalles}
          setFacturaDetalles={(detalles) =>
            setFactura({ ...factura, facturaDetalles: detalles })
          }
        />

        <Button variant="primary" type="submit" className="mt-3">
          {id ? "Actualizar" : "Agregar"}
        </Button>
      </Form>
    </Layout>
  );
};

export default FacturaForm;
