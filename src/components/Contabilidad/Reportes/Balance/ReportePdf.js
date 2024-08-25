import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Page, Document } from "@react-pdf/renderer";
import axios from 'axios';

export default function ReportePdf({fechaInicio, fechaFin}) {
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
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Balance General</Text>
        </View>
        {fechaInicio && fechaFin ? (
          <View style={styles.containerText}>
            <Text style={styles.text}>{fechaInicio.toISOString().split('T')[0]} - {fechaFin.toISOString().split('T')[0]}</Text>
          </View>
        ) : (
          <Text style={styles.text}>Fechas no disponibles</Text>
        )}
  
        {/* Contenedor para las dos tablas */}
        <View style={styles.tablesContainer}>
          {/* Tabla Activo */}
          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.headerFirst}>
                  <Text>Activo</Text>
              </View>
            </View>
            {activos.map(activo => 
              <>
              <View key={activo.codigo} style={styles.row}>
                <View style={styles.cellPatternName}>
                  <Text>{activo.nombre}</Text>
                </View>
                <View style={styles.cell}>
                    <Text>{findBalancePadre(activo.codigo).toFixed(2)}</Text>
                </View>              
              </View>
              {activo.cuentas.map(cuenta => (
                <View key={cuenta.codigo} style={styles.row}>
                  <View style={styles.cellFirst}>
                    <Text>{cuenta.nombre}</Text>
                  </View>
                  <View style={styles.cell}>
                      <Text>{findBalance(cuenta.codigo).toFixed(2)}</Text>
                  </View>              
                </View>
              )) }
              </>
            )}
          </View>
  
          {/* Tabla Pasivo y Patrimonio */}
          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.headerFirst}>
                  <Text>Pasivo</Text>
              </View>
            </View>
            {pasivos.map(pasivo => 
              <>
              <View key={pasivo.codigo} style={styles.row}>
                <View style={styles.cellPatternName}>
                  <Text>{pasivo.nombre}</Text>
                </View>
                <View style={styles.cell}>
                    <Text>{findBalancePadre(pasivo.codigo).toFixed(2)}</Text>
                </View>              
              </View>
              {pasivo.cuentas.map(cuenta => (
                <View key={cuenta.codigo} style={styles.row}>
                  <View style={styles.cellFirst}>
                    <Text>{cuenta.nombre}</Text>
                  </View>
                  <View style={styles.cell}>
                      <Text>{findBalance(cuenta.codigo).toFixed(2)}</Text>
                  </View>              
                </View>
              )) }
              </>
            )}
  
            <View style={styles.row}>
              <View style={styles.headerFirst}>
                  <Text>Patrimonio</Text>
              </View>
            </View>
            {patrimonios.map(patrimonio => 
              <>
              <View key={patrimonio.codigo} style={styles.row}>
                <View style={styles.cellPatternName}>
                  <Text>{patrimonio.nombre}</Text>
                </View>
                <View style={styles.cell}>
                    <Text>{findBalancePadre(patrimonio.codigo).toFixed(2)}</Text>
                </View>              
              </View>
              {patrimonio.cuentas.map(cuenta => (
                <View key={cuenta.codigo} style={styles.row}>
                  <View style={styles.cellFirst}>
                    <Text>{cuenta.nombre}</Text>
                  </View>
                  <View style={styles.cell}>
                      <Text>{findBalance(cuenta.codigo).toFixed(2)}</Text>
                  </View>              
                </View>
              )) }
              </>
            )}
          </View>
        </View>

        {/* Contenedor para la suma de los balances */}
        <View style={styles.tablesContainer}>
          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.cellPatternName}>
                <Text>Total Activos</Text>
              </View>
              <View style={styles.cell}>
                  <Text>{totalActivos.toFixed(2)}</Text>
              </View>              
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.cellPatternName}>
                <Text>Total Pasivo + Patrimonio</Text>
              </View>
              <View style={styles.cell}>
                  <Text>{(totalPasivos+totalPatrimonio).toFixed(2)}</Text>
              </View>              
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
  
}

const styles = StyleSheet.create({
  page:{
    padding: '20px',
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    textAlign: 'center',
    textTransform: 'uppercase',
    padding: '10px'
  },
  section: {
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: '11px',
    padding: '5px',
    textAlign: 'center'
  },
  tablesContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row', // Esta propiedad coloca las tablas una al lado de la otra
    justifyContent: 'space-between'
  },
  table: {
    width: '48%', // Asegúrate de que ambas tablas juntas no sobrepasen el 100% del ancho
    margin: '10rem auto',
    padding: '5px',
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column'
  },
  row:{
    flexDirection: 'row',
    borderBottom: '1px solid #ccc',
    marginTop: '5px',
    padding: '10px'
  },
  headerFirst:{
    width: '70%',
    textAlign: 'center',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: 'royalblue'
  },
  cell: {
    width: '30%',
    textAlign: 'right', 
    color: '#222'
  },
  cellFirst: {
    width: '70%',
    textAlign: 'left', 
    color: '#222'
  },
  cellPatternName: {
    width: '70%',
    textAlign: 'left', 
    color: '#222',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  containerText: {
    width: '400px'
  }
});
