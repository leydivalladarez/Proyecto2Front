import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';

const DepreciacionDetalle = ({ depreciacionDetalles = [], setDepreciacionDetalles }) => {
  const [activos, setActivos] = useState([]);
  // const [subtotal, setSubtotal] = useState(0);
  const [detalleNuevo, setDetalleNuevo] = useState({
    activo: {id : ''},
    periodoDepreciacion: 1,
    valorDepreciacion: '',
  });

  useEffect(() => {
    // Cargar la lista de artículos
    axios
      .get('http://localhost:8080/api/v1/activos')
      .then((response) => {
        setActivos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const agregarDetalle = () => {
    console.table(detalleNuevo);
    // return;
    if (!detalleNuevo.activo.id || !detalleNuevo.valorDepreciacion) {
      return;
    }

    setDepreciacionDetalles([...depreciacionDetalles, { ...detalleNuevo }]);
    setDetalleNuevo({
      activo: {id : ''},
      periodoDepreciacion: 1,
      valorDepreciacion: '',
    });
  };

  const handleActivoAgregarDetalle = (valor) => {
    const activo = activos.find((a) => a.id.toString() === valor);
    if(activo){
        setDetalleNuevo({
            ...detalleNuevo,
            activo: {id : valor},
            periodoDepreciacion: activo.periodosDepreciacionTotal+1,
            valorDepreciacion: activo.valorDepreciacion,
        });
    }    
  }

  const handleDetalleChange = (index, campo, valor) => {
    const nuevosDetalles = [...depreciacionDetalles];

    if (campo === 'activoId') {
      const activo = activos.find((a) => a.id.toString() === valor);
      if (activo) {
        nuevosDetalles[index].activo = activo;
        nuevosDetalles[index].periodoDepreciacion = activo.periodosDepreciacionTotal+1;
      } else {
        nuevosDetalles[index].periodoDepreciacion = '';
      }
    } else {
      nuevosDetalles[index][campo] = valor;

    }

    setDepreciacionDetalles(nuevosDetalles);
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = depreciacionDetalles.filter((_, i) => i !== index);
    setDepreciacionDetalles(nuevosDetalles);
  };

  return (
    <div>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Activo</th>
            <th>Periodo Depreciación</th>
            <th>Valor Depreciación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {depreciacionDetalles.map((detalle, index) => (
            <tr key={index}>
              <td>
                <Form.Select
                  value={detalle.activo.id}
                  onChange={(e) =>
                    handleDetalleChange(index, 'activoId', e.target.value)
                  }
                >
                  <option value="">Seleccione un activo</option>
                  {activos.map((activo) => (
                    <option key={activo.id} value={activo.id}>
                      {activo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="number"
                  min="1"
                  value={detalle.periodoDepreciacion}
                  onChange={(e) =>
                    handleDetalleChange(index, 'periodoDepreciacion', Number(e.target.value))
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={detalle.valorDepreciacion}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Expresión regular para permitir solo números con hasta 2 decimales
                    const regex = /^\d+(\.\d{0,2})?$/;
                    if (regex.test(value)) {
                      handleDetalleChange(index, 'valorDepreciacion', Number(e.target.value));
                    }
                  }}
                />
              </td>
              <td className='d-flex justify-content-center'>
                <Button variant="danger" onClick={() => eliminarDetalle(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <Form.Select
                value={detalleNuevo.activo.id}
                onChange={(e) =>
                  handleActivoAgregarDetalle(e.target.value)
                }
              >
                <option value="">Seleccione un artículo</option>
                {activos.map((activo) => (
                  <option key={activo.id} value={activo.id}>
                    {activo.nombre}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <Form.Control
                type="number"
                min="1"
                value={detalleNuevo.periodoDepreciacion}
                onChange={(e) =>
                  setDetalleNuevo({
                    ...detalleNuevo,
                    periodoDepreciacion: Number(e.target.value),
                  })
                }
              />
            </td>
            <td>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={detalleNuevo.valorDepreciacion}
                onChange={(e) =>
                  setDetalleNuevo({
                    ...detalleNuevo,
                    valorDepreciacion: Number(e.target.value),
                  })
                }
              />
            </td>
            <td className='d-flex justify-content-center'>
              <Button variant="primary" onClick={agregarDetalle}>
                <FontAwesomeIcon icon={faAdd} />
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default DepreciacionDetalle;
