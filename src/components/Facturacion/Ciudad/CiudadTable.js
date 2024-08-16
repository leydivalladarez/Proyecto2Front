import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const CiudadTable = () => {
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCiudad, setSelectedCiudad] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchCiudades = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/ciudades');
      setCiudades(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCiudades();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/ciudades/${selectedCiudad.codigo}`);
      setCiudades(ciudades.filter(ciudad => ciudad.codigo !== selectedCiudad.codigo));
      setShowModal(false);
    } catch (error) {
      setError(error);
      setShowModal(false);
    }
  };

  const handleShowModal = (ciudad) => {
    setSelectedCiudad(ciudad);
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
            <th className='d-flex justify-content-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ciudades.map(ciudad => (
            <tr key={ciudad.codigo}>
              <td>{ciudad.codigo}</td>
              <td>{ciudad.nombre}</td>
              <td className='d-flex justify-content-center'>
                <Button className='mx-1' variant="primary" onClick={() => navigate(`/ciudades/editar/${ciudad.codigo}`)}>
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button className='mx-1' variant="danger" onClick={() => handleShowModal(ciudad)}>
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
          ¿Estás seguro de que deseas eliminar a {selectedCiudad?.nombre}?
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

export default CiudadTable;
