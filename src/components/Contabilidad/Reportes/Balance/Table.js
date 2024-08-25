import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Table, Container } from "react-bootstrap";

const BalanceTable = ({ fechaInicio, fechaFin }) => {
  const [balances, setBalances] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalances = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/reportes/balance-general",
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
      const cIngresos = data.filter((cuenta) => cuenta.tipoCuenta.nombre.toLowerCase().includes('ingreso'));
      const cEgresos = data.filter((cuenta) => cuenta.tipoCuenta.nombre.toLowerCase().includes('egreso'));
      //Sumar el balance de ingresos y restar el balance de egresos
      let bIngresos = 0;
      let bEgresos = 0;
      cIngresos.forEach((cuenta) => {
        bIngresos += cuenta.balance;
      });
      cEgresos.forEach((cuenta) => {
        bEgresos += cuenta.balance;
      });
      const totalBalance = bIngresos + bEgresos;
      //Crear una cuenta llamada utilidad o perdida acumulada con el valor de totalBalance
      const cuentaUtilidad = {
        codigo: 1000,
        nombre: "Utilidad o Perdida Acumulada",
        balance: totalBalance,
        tipoCuenta: { nombre: "patrimonio" },
        cuentas: [],
      };
      data.push(cuentaUtilidad);
      
      setBalances(data);
      setLoading(false);
      setBalances(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  const fetchCuentas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/cuentas/jerarquico"
      );
      const data = response.data;
      // const cuentaCapital = data.filter(c => c.nombre.toLowerCase().includes('capital'));
      
      const cuentaUtilidad = {
        codigo: 1000,
        nombre: "Utilidad o Perdida Acumulada",
        tipoCuenta: { nombre: "patrimonio" },
        cuentas: []
      };
      for(let i = 0; i < data.length; i++){
        if(data[i].nombre.toLowerCase().includes('capital')){
          data[i].cuentas.push(cuentaUtilidad);
        }
      }
      setCuentas(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const findBalance = (codigo) => {
    const cuentaBalance = balances.find((balance) => balance.codigo === codigo);
    return (cuentaBalance ? (cuentaBalance.tipoCuenta.nombre === 'Activo' ? cuentaBalance.balance: cuentaBalance.balance * -1) : 0);
  };

  const findBalancePadre = (codigo) => {
    const cuenta = cuentas.find((cuenta) => cuenta.codigo === codigo);
    let sumaBalance = 0;
    cuenta.cuentas.forEach((cuenta) => {
      sumaBalance += findBalance(cuenta.codigo);
    });
    return sumaBalance;
  }

  const cuentasRaices = () => {
    const cuentasOrdenadas = Object.values(cuentas).sort(
      (a, b) => a.codigo - b.codigo
    );
    const activos = cuentasOrdenadas.filter(
      (cuenta) => cuenta.tipoCuenta.nombre === "Activo"
    );
    const pasivos = cuentasOrdenadas.filter(
      (cuenta) => cuenta.tipoCuenta.nombre === "Pasivo"
    );
    const patrimonios = cuentasOrdenadas.filter(
      (cuenta) =>
        cuenta.tipoCuenta.nombre.toLowerCase().includes("patrimonio") ||
        cuenta.tipoCuenta.nombre.toLowerCase().includes("capital")
    );
    return [activos, pasivos, patrimonios];
  };

  const [activos, pasivos, patrimonios] = cuentasRaices();

  const sumaBalances = () => {
    let totalActivos = 0;
    let totalPasivos = 0;
    let totalPatrimonio = 0;

    balances.forEach((cuenta) => {
      if (cuenta.tipoCuenta.nombre === "Activo") {
        totalActivos += cuenta.balance;
      } else if (cuenta.tipoCuenta.nombre === "Pasivo") {
        totalPasivos -= cuenta.balance;
      } else if (
        cuenta.tipoCuenta.nombre.toLowerCase().includes("patrimonio") ||
        cuenta.tipoCuenta.nombre.toLowerCase().includes("capital")
      ) {
        totalPatrimonio -= cuenta.balance;
      }else{
        /* let resultados = 0;
        if(cuenta.tipoCuenta.nombre === "Ingreso"){
          resultados -= cuenta.balance;
        }else{
          resultados += cuenta.balance;
        }
        totalPatrimonio += resultados; */
      }
    });

    return [totalActivos, totalPasivos, totalPatrimonio];
  }

  const [totalActivos, totalPasivos, totalPatrimonio] = sumaBalances();

  useEffect(() => {
    fetchBalances();
    fetchCuentas();
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
                  Activo
                </th>
              </tr>
            </thead>
            <tbody>
              {activos.map((activo) => (
                <React.Fragment key={activo.codigo}>
                  <tr>
                    <th>{activo.nombre}</th>
                    <th className="text-end" style={{ minWidth: "100px" }}>
                      {findBalancePadre(activo.codigo).toFixed(2)}
                    </th>
                  </tr>
                  {activo.cuentas.map((cuenta) => (
                    <tr key={cuenta.codigo}>
                      <td>{cuenta.nombre}</td>
                      <td className="text-end">{findBalance(cuenta.codigo).toFixed(2)}</td>
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
                  Pasivo
                </th>
              </tr>
            </thead>
            <tbody>
              {pasivos.map((pasivo) => (
                <React.Fragment key={pasivo.codigo}>
                  <tr>
                    <th>{pasivo.nombre}</th>
                    <th className="text-end" style={{ minWidth: "100px" }}>
                      {findBalancePadre(pasivo.codigo).toFixed(2)}
                    </th>
                  </tr>
                  {pasivo.cuentas.map((cuenta) => (
                    <tr key={cuenta.codigo}>
                      <td>{cuenta.nombre}</td>
                      <td className="text-end">{findBalance(cuenta.codigo).toFixed(2)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              <tr>
                <th className="text-center">
                  Total Pasivo
                </th>
                <th className="text-end">
                  {totalPasivos.toFixed(2)}
                </th>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th colSpan={2} className="text-center">
                  Patrimonio o Capital
                </th>
              </tr>
            </thead>
            <tbody>
              {patrimonios.map((patrimonio) => (
                <React.Fragment key={patrimonio.codigo}>
                  <tr>
                    <th>{patrimonio.nombre}</th>
                    <th className="text-end" style={{ minWidth: "100px" }}>
                      {findBalancePadre(patrimonio.codigo).toFixed(2)}
                    </th>
                  </tr>
                  {patrimonio.cuentas.map((cuenta) => (
                    <tr key={cuenta.codigo}>
                      <td>{cuenta.nombre}</td>
                      <td className="text-end">{findBalance(cuenta.codigo).toFixed(2)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              <tr>
                <th className="text-center">
                  Total Patrimonio
                </th>
                <th className="text-end" style={{ minWidth: "100px" }}>
                  {totalPatrimonio.toFixed(2)}
                </th>
              </tr>
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
                  Total Activo
                </th>
                <th className="text-end">{totalActivos.toFixed(2)}</th>
              </tr>
            </thead>
          </Table>
        </Col>
        <Col lg={6}>
          <Table bordered>
            <thead>
              <tr>
                <th>
                  Total Pasivo + Patrimonio
                </th>
                <th className="text-end" style={{ minWidth: "100px" }}>{(totalPasivos + totalPatrimonio).toFixed(2)}</th>
              </tr>
            </thead>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default BalanceTable;
