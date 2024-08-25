import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Table, Container } from "react-bootstrap";

const ResultadosTable = ({ fechaInicio, fechaFin }) => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalances = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/reportes/estado-resultados",
        fechaInicio && fechaFin
          ? {
              params: {
                fechaInicio: fechaInicio.toISOString().split("T")[0],
                fechaFin: fechaFin.toISOString().split("T")[0],
              },
            }
          : {}
      );
      const data = response.data;
      
      setBalances(data);
      setLoading(false);
      setBalances(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  const cuentasRaices = () => {
    const cuentasOrdenadas = Object.values(balances).sort(
      (a, b) => a.codigo - b.codigo
    );
    const ingresos = cuentasOrdenadas.filter(
      (cuenta) => cuenta.tipoCuenta.nombre.toLowerCase().includes('ingreso')
    );
    const egresos = cuentasOrdenadas.filter(
      (cuenta) => cuenta.tipoCuenta.nombre.toLowerCase().includes('egreso')
    );
    return [ingresos, egresos];
  };

  const [ingresos, egresos] = cuentasRaices();

  const sumaBalances = () => {
    let totalIngresos = 0;
    let totalEgresos = 0;

    balances.forEach((cuenta) => {
      if (cuenta.tipoCuenta.nombre.toLowerCase().includes('ingreso')) {
        totalIngresos += cuenta.balance;
      } else if (cuenta.tipoCuenta.nombre.toLowerCase().includes('egreso')) {
        totalEgresos += cuenta.balance;
      }
    });

    return [totalIngresos, totalEgresos];
  }

  const [totalIngresos, totalEgresos] = sumaBalances();

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error al cargar los datos: {error.message}</p>;
  }

  return (
    <Container className='mt-3'>
      <Row>
        <Col lg={6}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th colSpan={2} className="text-center">
                  Ingreso
                </th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((ingreso) => (
                <React.Fragment key={ingreso.codigo}>
                  <tr>
                    <th>{ingreso.nombre}</th>
                    <th className="text-end" style={{ minWidth: "100px" }}>
                      {ingreso.balance.toFixed(2)}
                    </th>
                  </tr>
                  {ingreso.cuentas.map((cuenta) => (
                    <tr key={cuenta.codigo}>
                      <td>{cuenta.nombre}</td>
                      <td className="text-end">{cuenta.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col lg={6}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th colSpan={2} className="text-center">
                  Egreso
                </th>
              </tr>
            </thead>
            <tbody>
              {egresos.map((egreso) => (
                <React.Fragment key={egreso.codigo}>
                  <tr>
                    <th>{egreso.nombre}</th>
                    <th className="text-end" style={{ minWidth: "100px" }}>
                      {egreso.balance.toFixed(2)}
                    </th>
                  </tr>
                  {egreso.cuentas.map((cuenta) => (
                    <tr key={cuenta.codigo}>
                      <td>{cuenta.nombre}</td>
                      <td className="text-end">{cuenta.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Table bordered>
            <thead>
              <tr>
                <th>
                  Total Ingresos
                </th>
                <th className="text-end">{totalIngresos.toFixed(2)}</th>
              </tr>
            </thead>
          </Table>
        </Col>
        <Col lg={6}>
          <Table bordered>
            <thead>
              <tr>
                <th>
                  Total Egresos
                </th>
                <th className="text-end">{totalEgresos.toFixed(2)}</th>
              </tr>
            </thead>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Table bordered>
            <thead>
              <tr>
                <th>
                  Utilidad
                </th>
                <th className="text-end">{(totalIngresos - totalEgresos).toFixed(2)}</th>
              </tr>
            </thead>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ResultadosTable;
