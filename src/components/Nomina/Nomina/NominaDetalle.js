import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';

const NominaDetalle = ({ nominaDetalles = [], setNominaDetalles }) => {
  const [motivos, setMotivos] = useState([]);
  const [detalleNuevo, setDetalleNuevo] = useState({
    motivo: { codigo: '', tipo: '' },
    valor: '',
  });

  useEffect(() => {
    // Cargar la lista de motivos
    axios
      .get('http://localhost:8080/api/v1/motivos')
      .then((response) => {
        setMotivos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const agregarDetalle = () => {
    if (!detalleNuevo.motivo.codigo || !detalleNuevo.valor) {
      return;
    }

    setNominaDetalles([...nominaDetalles, { ...detalleNuevo }]);
    setDetalleNuevo({
      motivo: { codigo: '', tipo: '' },
      valor: '',
    });
  };

  const handleMotivoAgregarDetalle = (valor) => {
    const motivo = motivos.find((a) => a.codigo.toString() === valor);
    if (motivo) {
      setDetalleNuevo({
        ...detalleNuevo,
        motivo: { codigo: valor, tipo: motivo.tipo },
        valor: '',
      });
    }
  };

  const handleDetalleChange = (index, campo, valor) => {
    const nuevosDetalles = [...nominaDetalles];

    if (campo === 'motivoId') {
      const motivo = motivos.find((a) => a.codigo.toString() === valor);
      if (motivo) {
        nuevosDetalles[index].motivo = motivo;
      }
    } else {
      nuevosDetalles[index][campo] = valor;
    }

    setNominaDetalles(nuevosDetalles);
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = nominaDetalles.filter((_, i) => i !== index);
    setNominaDetalles(nuevosDetalles);
  };

  const calcularSumas = () => {
    let sumaDevengos = 0;
    let sumaDeducciones = 0;

    nominaDetalles.forEach((detalle) => {
      if (detalle.motivo.tipo === 'ingreso') {
        sumaDevengos += detalle.valor;
      } else if (detalle.motivo.tipo === 'egreso') {
        sumaDeducciones += detalle.valor;
      }
    });

    return { sumaDevengos, sumaDeducciones };
  };

  const { sumaDevengos, sumaDeducciones } = calcularSumas();
  const liquidoAPercibir = sumaDevengos - sumaDeducciones;

  return (
    <div>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Motivo</th>
            <th>Devengos</th>
            <th>Deducciones</th>
            <th className='d-flex justify-content-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {nominaDetalles.map((detalle, index) => (
            <tr key={index}>
              <td>
                <Form.Select
                  value={detalle.motivo.codigo}
                  onChange={(e) =>
                    handleDetalleChange(index, 'motivoId', e.target.value)
                  }
                >
                  <option value="">Seleccione un motivo</option>
                  {motivos.map((motivo) => (
                    <option key={motivo.codigo} value={motivo.codigo}>
                      {motivo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </td>              
              <td>
                {detalle.motivo.tipo === 'ingreso' && (
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={detalle.valor}
                    onChange={(e) => {
                      const value = e.target.value;
                      const regex = /^\d+(\.\d{0,2})?$/;
                      if (regex.test(value)) {
                        handleDetalleChange(index, 'valor', Number(value));
                      }
                    }}
                  />
                )}
              </td>
              <td>
                {detalle.motivo.tipo === 'egreso' && (
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={detalle.valor}
                    onChange={(e) => {
                      const value = e.target.value;
                      const regex = /^\d+(\.\d{0,2})?$/;
                      if (regex.test(value)) {
                        handleDetalleChange(index, 'valor', Number(value));
                      }
                    }}
                  />
                )}
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
                value={detalleNuevo.motivo.codigo}
                onChange={(e) =>
                  handleMotivoAgregarDetalle(e.target.value)
                }
              >
                <option value="">Seleccione un motivo</option>
                {motivos.map((motivo) => (
                  <option key={motivo.codigo} value={motivo.codigo}>
                    {motivo.nombre}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              {detalleNuevo.motivo.tipo === 'ingreso' && (
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={detalleNuevo.valor}
                  onChange={(e) =>{
                    const value = e.target.value;
                    const regex = /^\d+(\.\d{0,2})?$/;
                    if (regex.test(value)) {
                      setDetalleNuevo({
                        ...detalleNuevo,
                        valor: Number(e.target.value),
                      })
                    }
                  }}
                />
              )}
            </td>
            <td>
              {detalleNuevo.motivo.tipo === 'egreso' && (
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={detalleNuevo.valor}
                  onChange={(e) =>{
                    const value = e.target.value;
                    const regex = /^\d+(\.\d{0,2})?$/;
                    if (regex.test(value)) {
                      setDetalleNuevo({
                        ...detalleNuevo,
                        valor: Number(e.target.value),
                      })
                    }
                  }}
                />
              )}
            </td>
            <td className='d-flex justify-content-center'>
              <Button variant="primary" onClick={agregarDetalle}>
                <FontAwesomeIcon icon={faAdd} />
              </Button>
            </td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>{sumaDevengos.toFixed(2)}</strong></td>
            <td><strong>{sumaDeducciones.toFixed(2)}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
      <h5 className="mt-3">Líquido a Percibir: <strong>{liquidoAPercibir.toFixed(2)}</strong></h5>
    </div>
  );
};

export default NominaDetalle;
