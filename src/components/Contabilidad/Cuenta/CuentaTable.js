import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const CuentaTable = ({ searchTerm }) => {
  const [cuentas, setCuentas] = useState([]);
  const [cuentasArbol, setCuentasArbol] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState(null);

  const navigate = useNavigate();

  const fetchCuentas = useCallback(async (searchTerm = '') => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/cuentas`, {
        params: {
          buscar: searchTerm,
        },
      });
      const cuentasData = response.data;
      setCuentas(cuentasData);
      setCuentasArbol(organizarCuentasEnArbol(cuentasData));
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    fetchCuentas(searchTerm);
  }, [fetchCuentas, searchTerm]);

  const organizarCuentasEnArbol = (cuentas) => {
    const cuentasMap = {};
    cuentas.forEach(cuenta => {
      cuentasMap[cuenta.codigo] = { ...cuenta, children: [] };
    });

    const cuentasArbol = [];
    cuentas.forEach(cuenta => {
      if (cuenta.cuentaPadre) {
        cuentasMap[cuenta.cuentaPadre.codigo].children.push(cuentasMap[cuenta.codigo]);
      } else {
        cuentasArbol.push(cuentasMap[cuenta.codigo]);
      }
    });

    return cuentasArbol;
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/cuentas/${selectedCuenta.codigo}`);
      setCuentas(cuentas.filter(cuenta => cuenta.codigo !== selectedCuenta.codigo));
      setCuentasArbol(organizarCuentasEnArbol(cuentas.filter(cuenta => cuenta.codigo !== selectedCuenta.codigo)));
      setShowModal(false);
    } catch (error) {
      setError(error);
      setShowModal(false);
    }
  };

  const handleShowModal = (cuenta) => {
    setSelectedCuenta(cuenta);
    setShowModal(true);
  };

  const renderCuentas = (cuentas, level = 0, parentIndex = '') => {
    return cuentas.map((cuenta, index) => {
      const currentIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
  
      return (
        <React.Fragment key={cuenta.codigo}>
          <tr>
            <td>{currentIndex}</td>
            <td style={{ paddingLeft: `${level * 20}px` }}>{cuenta.nombre}</td>
            <td>{cuenta.tipoCuenta.nombre}</td>
            <td className='d-flex justify-content-center'>
              <Button className='mx-1' variant="primary" onClick={() => navigate(`/contabilidad/cuentas/editar/${cuenta.codigo}`)}>
                <FontAwesomeIcon icon={faPencil} />
              </Button>
              <Button className='mx-1' variant="danger" onClick={() => handleShowModal(cuenta)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </td>
          </tr>
          {cuenta.children.length > 0 && renderCuentas(cuenta.children, level + 1, currentIndex)}
        </React.Fragment>
      );
    });
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
            <th>Tipo de Cuenta</th>
            <th className='d-flex justify-content-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {renderCuentas(cuentasArbol)}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar a {selectedCuenta?.nombre}?
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

export default CuentaTable;
