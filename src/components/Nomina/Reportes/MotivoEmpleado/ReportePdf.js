import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Page, Document } from "@react-pdf/renderer";
import axios from 'axios';

export default function ReportePdf({fechaInicio, fechaFin}) {
  const [motivos, setMotivos] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  const fetchEmpleados = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/reportes/reporte-motivos', 
        (fechaInicio && fechaFin) ? {
        params: {
          fechaInicio: fechaInicio.toISOString().split('T')[0],
          fechaFinal: fechaFin.toISOString().split('T')[0]
        }
      }:{});
      setEmpleados(response.data);
    } catch (error) {
    }
  }, [fechaInicio, fechaFin]);

  const fetchMotivos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/motivos');
      setMotivos(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchMotivos();
    fetchEmpleados();
  }, [fetchEmpleados]);

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Reporte de Nómina Cruzada (Empleado/Motivo)</Text>
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
                <Text>Empleado\Motivo</Text>
            </View>
            {motivos.map(motivo => (
              <View style={styles.header}>
                <Text>{motivo.nombre}</Text>
              </View>
            ))}
          </View>
          {empleados.map(empleado => 
            <View key={empleado.empleadoId} style={styles.row}>
              <View style={styles.cellFirst}>
                <Text>{empleado.nombreEmpleado}</Text>
              </View>
              {motivos.map(motivo => (
                <View style={styles.cell}>
                  <Text>{(empleado.motivosPorEmpleado[motivo.codigo] ?? 0).toFixed(2)}</Text>
                </View>
              )) }
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