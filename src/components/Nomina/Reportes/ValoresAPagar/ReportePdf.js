import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Page, Document } from "@react-pdf/renderer";
import axios from 'axios';

export default function ReportePdf({fechaInicio, fechaFin}) {
  const [valores, setValores] = useState([]);

  const fetchValores = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/reportes/valores-a-pagar', 
        (fechaInicio && fechaFin) ? {
        params: {
          fechaInicio: fechaInicio.toISOString().split('T')[0],
          fechaFinal: fechaFin.toISOString().split('T')[0]
        }
      }:{});
      setValores(response.data);
    } catch (error) {
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    fetchValores();
  }, [fetchValores]);

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Valores a pagar por Empleado</Text>
        </View>
        {fechaInicio && fechaFin ? (
          <View style={styles.containerText}>
            <Text style={styles.text}>{fechaInicio.toISOString().split('T')[0]} - {fechaFin.toISOString().split('T')[0]}</Text>
          </View>
        ) : (
          <Text style={styles.text}>Fechas no disponibles</Text>
        )}
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.headerFirst}>
                <Text>Empleado</Text>
            </View>
            <View style={styles.headerFirst}>
                <Text>Valor a pagar</Text>
            </View>
          </View>
          {valores.map((valor, index) => 
            <View key={index} style={styles.row}>
              <View style={styles.cellFirst}>
                <Text>{valor.nombreEmpleado}</Text>
              </View>
              <View style={styles.cellFirst}>
                <Text>{valor.valorTotal ? valor.valorTotal.toFixed(2) : '0.00'}</Text>
              </View>
            </View>
          )}
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
      flexDirection: 'column',
      display: 'flex',
      alignItems: 'center',
      padding: '10px'
  },
  logo: {
      width: '300px',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '3px',
      margin: 'auto'
  },
  section: {
      width: '80%',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'flex-end',
      flexDirection: 'column'
  },
  text: {
      fontSize: '11px',
      padding: '5px',
      textAlign: 'center'
  },
  table: {
      width: '80%',
      margin: '10rem auto',
      padding: '5px',
      fontSize: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
  },
  row:{
      flexDirection: 'row',
      borderBottom: '1px solid #ccc',
      marginTop: '5px',
      padding: '10px'
  },
  header:{
      width: '20%',
      textAlign: 'center',
      fontWeight: '800',
      textTransform: 'uppercase',
      color: 'royalblue'
  },
  headerFirst:{
    width: '30%',
    textAlign: 'center',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: 'royalblue'
  },
  cell: {
      width: '20%',
      textAlign: 'center', 
      color: '#222'
  },
  cellFirst: {
    width: '30%',
    textAlign: 'center', 
    color: '#222'
},
  containerText: {
      width: '400px'
  }
});