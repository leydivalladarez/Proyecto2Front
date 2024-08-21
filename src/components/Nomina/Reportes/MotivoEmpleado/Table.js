import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const Table = ({fechaInicio, fechaFin}) => {
  const [motivos, setMotivos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  const fetchMotivos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/motivos');
      setMotivos(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotivos();
    fetchEmpleados();
  }, [fetchEmpleados]);


  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error al cargar los datos: {error.message}</p>;
  }

  return (
    <div className="d-flex">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Empleado\Motivo</th>
            {motivos.map(motivo => (
              <th>{motivo.nombre}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empleados.map(empleado => (
            <tr key={empleado.empleadoId}>
              <td>{empleado.nombreEmpleado}</td>
              {motivos.map(motivo => (
                <td>{(empleado.motivosPorEmpleado[motivo.codigo] ?? 0).toFixed(2)}</td>
              )) }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
