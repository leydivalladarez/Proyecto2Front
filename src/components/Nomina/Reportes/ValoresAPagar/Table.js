import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Table = () => {
  const [valores, setValores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchValores = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/reportes/valores-a-pagar');
      setValores(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValores();
  }, []);


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
            <th>Empleado</th>
            <th>Valor a Pagar</th>
          </tr>
        </thead>
        <tbody>
          {valores.map(valor => (
            <tr key={valor.codigo}>
              <td>{valor.nombreEmpleado}</td>
              <td>{valor.valorTotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
