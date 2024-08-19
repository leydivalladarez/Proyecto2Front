import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const Table = () => {
  const [depreciaciones, setDepreciaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepreciacion, setSelectedDepreciacion] = useState(null);

  const navigate = useNavigate();

  const fetchDepreciaciones = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/depreciaciones');
      setDepreciaciones(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepreciaciones();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/depreciaciones/${selectedDepreciacion.numero}`);
      setDepreciaciones(depreciaciones.filter(depreciacion => depreciacion.numero !== selectedDepreciacion.numero));
      setShowModal(false);
    } catch (error) {
      setError(error);
      setShowModal(false);
    }
  };

  const handleShowModal = (depreciacion) => {
    setSelectedDepreciacion(depreciacion);
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
            <th>Responsable</th>
            <th className='d-flex justify-content-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {depreciaciones.map(depreciacion => (
            <tr key={depreciacion.numero}>
              <td><Link to={`/activo/depreciaciones/editar/${depreciacion.numero}`}>{depreciacion.numero}</Link></td>
              <td>{depreciacion.fecha}</td>
              <td>{depreciacion.observaciones}</td>
              <td>{depreciacion.responsable}</td>
              <td className='d-flex justify-content-center'>
                <Button className='mx-1' variant="primary" onClick={() => navigate(`/activo/depreciaciones/editar/${depreciacion.numero}`)}>
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button className='mx-1' variant="danger" onClick={() => handleShowModal(depreciacion)}>
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
          ¿Estás seguro de que deseas eliminar depreciacion {selectedDepreciacion?.numero}?
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

export default Table;
