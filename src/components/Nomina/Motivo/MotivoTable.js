import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const MotivoTable = ({ searchTerm }) => {
  const [motivos, setMotivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMotivo, setSelectedMotivo] = useState(null);

  const navigate = useNavigate();

  const fetchMotivos = async (searchTerm = '') => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/motivos', {
        params: {
          buscar: searchTerm,
        },
      });
      setMotivos(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotivos(searchTerm);
  }, [searchTerm]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/motivos/${selectedMotivo.codigo}`);
      setMotivos(motivos.filter(motivo => motivo.codigo !== selectedMotivo.codigo));
      setShowModal(false);
    } catch (error) {
      setError(error);
      setShowModal(false);
    }
  };

  const handleShowModal = (motivo) => {
    setSelectedMotivo(motivo);
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
            <th>Código</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th className='d-flex justify-content-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {motivos.map(motivo => (
            <tr key={motivo.codigo}>
              <td>{motivo.codigo}</td>
              <td>{motivo.nombre}</td>
              <td className='text-capitalize'>{motivo.tipo}</td>
              <td className='d-flex justify-content-center'>
                <Button className='mx-1' variant="primary" onClick={() => navigate(`/nomina/motivos/editar/${motivo.codigo}`)}>
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button className='mx-1' variant="danger" onClick={() => handleShowModal(motivo)}>
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
          ¿Estás seguro de que deseas eliminar a {selectedMotivo?.nombre}?
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

export default MotivoTable;
