import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const Table = ({ searchTerm }) => {
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedNomina, setSelectedNomina] = useState(null);

  const navigate = useNavigate();

  const fetchNominas = async (searchTerm = '') => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/nominas', {
        params: {
          numero: searchTerm,
          nombre: searchTerm,
        },
      });
      setNominas(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNominas(searchTerm);
  }, [searchTerm]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/nominas/${selectedNomina.numero}`);
      setNominas(nominas.filter(nomina => nomina.numero !== selectedNomina.numero));
      setShowModal(false);
    } catch (error) {
      setError(error);
      setShowModal(false);
    }
  };

  const handleShowModal = (nomina) => {
    setSelectedNomina(nomina);
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
            <th>Empleado</th>
            <th className='d-flex justify-content-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {nominas.map(nomina => (
            <tr key={nomina.numero}>
              <td><Link to={`/nomina/nominas/editar/${nomina.numero}`}>{nomina.numero}</Link></td>
              <td>{nomina.fecha}</td>
              <td>{nomina.empleado.nombre}</td>
              <td className='d-flex justify-content-center'>
                <Button className='mx-1' variant="primary" onClick={() => navigate(`/nomina/nominas/editar/${nomina.numero}`)}>
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button className='mx-1' variant="danger" onClick={() => handleShowModal(nomina)}>
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
          ¿Estás seguro de que deseas eliminar nomina {selectedNomina?.numero}?
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
