import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Table = ({ fechaInicio, fechaFin, fetchTrigger }) => {
  const [depreciaciones, setDepreciaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepreciaciones = useCallback(async () => {
    if (!fechaInicio || !fechaFin) return;
    
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/reportes/depreciaciones`, {
        params: {
          fechaInicio: fechaInicio.toISOString().split('T')[0],
          fechaFin: fechaFin.toISOString().split('T')[0]
        }
      });
      setDepreciaciones(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);
  
  useEffect(() => {
    fetchDepreciaciones();
  }, [fetchTrigger, fetchDepreciaciones]);

  if (loading) {
    if(fechaInicio !== null && fechaFin !== null) {
    return <p>Cargando...</p>;
    }else{
      return <p>Debe seleccionar "Fecha de inicio" y "Fecha de fin" para consultar.</p>;
    }
  }

  if (error) {
    return <p>Error al cargar los datos: {error.message}</p>;
  }

  return (
    <div className="d-flex">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Activo</th>
            <th>Valor Depreciado</th>
          </tr>
        </thead>
        <tbody>
          {depreciaciones.map(depreciacion => (
            <tr key={depreciacion.activo.id}>
              <td>{depreciacion.activo.nombre}</td>
              <td>{depreciacion.valorDepreciado ? depreciacion.valorDepreciado.toFixed(2) : '0.00'}</td>              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
