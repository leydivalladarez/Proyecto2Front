import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const Table = ({ fechaInicio, fechaFin, fetchTrigger }) => {
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCiudades = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/reportes/ventas-totales-ciudades', 
        (fechaInicio && fechaFin) ? {
        params: {
          fechaInicio: fechaInicio.toISOString().split('T')[0],
          fechaFinal: fechaFin.toISOString().split('T')[0]
        }
      }:{});
      setCiudades(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    fetchCiudades();
  }, [fetchCiudades]);


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
            <th>Código</th>
            <th>Nombre</th>
            <th>Ventas Totales</th>
          </tr>
        </thead>
        <tbody>
          {ciudades.map(ciudad => (
            <tr key={ciudad.codigo}>
              <td>{ciudad.codigo}</td>
              <td>{ciudad.nombre}</td>
              <td>{ciudad.ventasTotales ? ciudad.ventasTotales.toFixed(2) : '0.00'}</td>              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
