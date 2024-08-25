import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Page, Document } from "@react-pdf/renderer";
import axios from 'axios';

export default function ReportePdf({fechaInicio, fechaFin}) {
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
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Estado de Resultados</Text>
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
                  <Text>Ingreso</Text>
              </View>
            </View>
            {ingresos.map(ingreso => 
              <>
              <View key={ingreso.codigo} style={styles.row}>
                <View style={styles.cellPatternName}>
                  <Text>{ingreso.nombre}</Text>
                </View>
                <View style={styles.cell}>
                    <Text>{ingreso.balance.toFixed(2)}</Text>
                </View>              
              </View>
              {ingreso.cuentas.map(cuenta => (
                <View key={cuenta.codigo} style={styles.row}>
                  <View style={styles.cellFirst}>
                    <Text>{cuenta.nombre}</Text>
                  </View>
                  <View style={styles.cell}>
                      <Text>{cuenta.balance.toFixed(2)}</Text>
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
                  <Text>Egreso</Text>
              </View>
            </View>
            {egresos.map(egreso => 
              <>
              <View key={egreso.codigo} style={styles.row}>
                <View style={styles.cellPatternName}>
                  <Text>{egreso.nombre}</Text>
                </View>
                <View style={styles.cell}>
                    <Text>{egreso.balance.toFixed(2)}</Text>
                </View>              
              </View>
              {egreso.cuentas.map(cuenta => (
                <View key={cuenta.codigo} style={styles.row}>
                  <View style={styles.cellFirst}>
                    <Text>{cuenta.nombre}</Text>
                  </View>
                  <View style={styles.cell}>
                      <Text>{cuenta.balance.toFixed(2)}</Text>
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
                <Text>Total Ingresos</Text>
              </View>
              <View style={styles.cell}>
                  <Text>{totalIngresos.toFixed(2)}</Text>
              </View>              
            </View>
            <View style={styles.row}>
              <View style={styles.cellPatternName}>
                <Text>Utilidad</Text>
              </View>
              <View style={styles.cell}>
                  <Text>{(totalIngresos - totalEgresos).toFixed(2)}</Text>
              </View>              
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.cellPatternName}>
                <Text>Total Egresos</Text>
              </View>
              <View style={styles.cell}>
                  <Text>{totalEgresos.toFixed(2)}</Text>
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
