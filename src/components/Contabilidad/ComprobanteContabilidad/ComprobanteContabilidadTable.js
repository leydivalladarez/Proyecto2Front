import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const ComprobanteContabilidadTable = ({ searchTerm }) => {
  const [comprobantesContabilidad, setComprobantesContabilidad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedComprobanteContabilidad, setSelectedComprobanteContabilidad] = useState(null);

  const navigate = useNavigate();

  const fetchComprobantesContabilidad = async (searchTerm = '') => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/comprobantesContabilidad', {
        params: {
          numero: searchTerm,
          // fecha: searchTerm,
        },
      });
      setComprobantesContabilidad(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComprobantesContabilidad(searchTerm);
  }, [searchTerm]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/comprobantesContabilidad/${selectedComprobanteContabilidad.numero}`);
      setComprobantesContabilidad(comprobantesContabilidad.filter(comprobanteContabilidad => comprobanteContabilidad.numero !== selectedComprobanteContabilidad.numero));
      setShowModal(false);
    } catch (error) {
      setError(error);
      setShowModal(false);
    }
  };

  const handleShowModal = (comprobanteContabilidad) => {
    setSelectedComprobanteContabilidad(comprobanteContabilidad);
    setShowModal(true);
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
            <th>Observaciones</th>
            <th className='d-flex justify-content-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprobantesContabilidad.map(comprobanteContabilidad => (
            <tr key={comprobanteContabilidad.numero}>
              <td><Link to={`/contabilidad/comprobantesContabilidad/editar/${comprobanteContabilidad.numero}`}>{comprobanteContabilidad.numero}</Link></td>
              <td>{comprobanteContabilidad.fecha}</td>
              <td>{comprobanteContabilidad.observaciones}</td>
              <td className='d-flex justify-content-center'>
                <Button className='mx-1' variant="primary" onClick={() => navigate(`/contabilidad/comprobantesContabilidad/editar/${comprobanteContabilidad.numero}`)}>
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button className='mx-1' variant="danger" onClick={() => handleShowModal(comprobanteContabilidad)}>
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
          ¿Estás seguro de que deseas eliminar comprobanteContabilidad {selectedComprobanteContabilidad?.numero}?
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

export default ComprobanteContabilidadTable;
