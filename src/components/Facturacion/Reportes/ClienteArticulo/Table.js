import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Table = () => {
  const [articulos, setArticulos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticulos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/reportes/ventas-cruzadas');
      setArticulos(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/clientes');
      setClientes(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
    fetchClientes();
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
            <th>Artículo\Cliente</th>
            {clientes.map(cliente => (
              <th>{cliente.nombre}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {articulos.map(articulo => (
            <tr key={articulo.codigoArticulo}>
              <td>{articulo.nombreArticulo}</td>
              {clientes.map(cliente => (
                <td>{(articulo.ventasPorCliente[cliente.id] ?? 0).toFixed(2)}</td>
              )) }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
