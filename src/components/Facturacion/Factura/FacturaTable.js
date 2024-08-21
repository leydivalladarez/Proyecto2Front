import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const FacturaTable = ({ searchTerm }) => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);

  const navigate = useNavigate();

  const fetchFacturas = async (searchTerm = '') => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/facturas', {
        params: {
          id: searchTerm,
          nombre: searchTerm,
        },
      });
      setFacturas(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas(searchTerm);
  }, [searchTerm]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/facturas/${selectedFactura.id}`);
      setFacturas(facturas.filter(factura => factura.id !== selectedFactura.id));
      setShowModal(false);
    } catch (error) {
      setError(error);
      setShowModal(false);
    }
  };

  const handleShowModal = (factura) => {
    setSelectedFactura(factura);
    setShowModal(true);
  };

  const formatInvoiceNumber = (id) => {
    // Ajusta el número de dígitos que deseas mostrar para el número de factura
    const paddedId = String(id).padStart(9, '0');
    return `001-001-${paddedId}`;
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error al cargar los datos: {error.message}</p>;
  }

  return (
    <div className="d-flex">
      <table className="table">
        <thead>
          <tr>
            <th>Nro</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Ciudad</th>
            <th className='d-flex justify-content-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map(factura => (
            <tr key={factura.id}>
              <td><Link to={`/facturacion/facturas/editar/${factura.id}`}>{formatInvoiceNumber(factura.id)}</Link></td>
              <td>{factura.fecha}</td>
              <td>{factura.cliente.nombre}</td>
              <td>{factura.ciudad.nombre}</td>
              <td className='d-flex justify-content-center'>
                <Button className='mx-1' variant="primary" onClick={() => navigate(`/facturacion/facturas/editar/${factura.id}`)}>
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button className='mx-1' variant="danger" onClick={() => handleShowModal(factura)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar factura {selectedFactura?.id}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacturaTable;
