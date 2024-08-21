import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const Table = ({ searchTerm }) => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  const navigate = useNavigate();

  const fetchEmpleados = async (searchTerm = '') => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/empleados', {
        params: { buscar: searchTerm },
      });
      setEmpleados(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados(searchTerm);
  }, [searchTerm]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/empleados/${selectedEmpleado.id}`);
      setEmpleados(empleados.filter(empleado => empleado.id !== selectedEmpleado.id));
      setShowModal(false);
    } catch (error) {
      setError(error);
      setShowModal(false);
    }
  };

  const handleShowModal = (empleado) => {
    setSelectedEmpleado(empleado);
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
            <th>ID</th>
            <th>Cedula</th>
            <th>Nombre</th>
            <th>Fecha Ingreso</th>
            <th>Sueldo</th>
            <th className='d-flex justify-content-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(empleado => (
            <tr key={empleado.id}>
              <td>{empleado.id}</td>
              <td>{empleado.cedula}</td>
              <td>{empleado.nombre}</td>
              <td>{empleado.fechaIngreso}</td>
              <td>{empleado.sueldo.toFixed(2)}</td>
              <td className='d-flex justify-content-center'>
                <Button className='mx-1' variant="primary" onClick={() => navigate(`/nomina/empleados/editar/${empleado.id}`)}>
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button className='mx-1' variant="danger" onClick={() => handleShowModal(empleado)}>
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
          ¿Estás seguro de que deseas eliminar a {selectedEmpleado?.nombre}?
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
