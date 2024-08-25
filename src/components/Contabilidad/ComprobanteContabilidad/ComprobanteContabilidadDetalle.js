import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Overlay, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCheck, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';

const ComprobanteContabilidadDetalle = ({ comprobanteContabilidadDetalles = [], setComprobanteContabilidadDetalles, setCuadrado, tipoTransaccion }) => {
  const [cuentas, setCuentas] = useState([]);
  const [detalleNuevo, setDetalleNuevo] = useState({
    cuenta: {codigo : ''},
    debe: '',
    haber: '',
  });
  const target = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Cargar la lista de artículos
    axios
      .get('http://localhost:8080/api/v1/cuentas')
      .then((response) => {
        const data = response.data;
        let cuentasFiltrada = [];
        // Filtrar cuentas por tipo de cuenta (Activo, Pasivo, Capital) para balance
        /* switch (tipoTransaccion) {
          case 'balance':
            cuentasFiltrada = data.filter((cuenta) => cuenta.tipoCuenta.nombre === 'Activo' || cuenta.tipoCuenta.nombre === 'Pasivo' || cuenta.tipoCuenta.nombre.toLowerCase().includes('patrimonio'));
            break;
          case 'resultado':
            cuentasFiltrada = data.filter((cuenta) => cuenta.tipoCuenta.nombre === 'Ingreso' || cuenta.tipoCuenta.nombre === 'Egreso');
            break;
          default:
            break;
        } */
        cuentasFiltrada = data.filter((cuenta) => cuenta.cuentaPadre !== null);
        setCuentas(cuentasFiltrada);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
  }, []);

  const agregarDetalle = () => {
    // return;
    if (!detalleNuevo.cuenta.codigo || !(detalleNuevo.debe || detalleNuevo.haber)) {
      return;
    }

    setComprobanteContabilidadDetalles([...comprobanteContabilidadDetalles, { ...detalleNuevo }]);    
    setDetalleNuevo({
      cuenta: {codigo : ''},
      debe: '',
      haber: '',
    });
    // calcularTotales([...comprobanteContabilidadDetalles, { ...detalleNuevo }]);
  };

  const handleCuentaAgregarDetalle = (valor) => {
    const cuenta = cuentas.find((a) => a.codigo.toString() === valor);
    if(cuenta){
        setDetalleNuevo({
            ...detalleNuevo,
            cuenta: {codigo : valor},
            debe: detalleNuevo.debe,
            haber: detalleNuevo.haber,
        });
    }    
  }

  const handleDetalleChange = (index, campo, valor) => {
    const nuevosDetalles = [...comprobanteContabilidadDetalles];

    if (campo === 'cuentaId') {
      const cuenta = cuentas.find((a) => a.codigo.toString() === valor);
      if (cuenta) {
        nuevosDetalles[index].cuenta = cuenta;        
      }
    } else {
      nuevosDetalles[index][campo] = valor;
    }

    setComprobanteContabilidadDetalles(nuevosDetalles);
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = comprobanteContabilidadDetalles.filter((_, i) => i !== index);
    setComprobanteContabilidadDetalles(nuevosDetalles);
  };

  const calcularSumas = () => {
    let sumaDebe = 0;
    let sumaHaber = 0;

    comprobanteContabilidadDetalles.forEach((detalle) => {
      sumaDebe += detalle.debe !== '' ? detalle.debe : 0;
      sumaHaber += detalle.haber !== '' ? detalle.haber : 0;
    });

    let cuadrado = sumaDebe === sumaHaber;
    setCuadrado(cuadrado);
    return { sumaDebe, sumaHaber, cuadrado };
  };

  const { sumaDebe, sumaHaber, cuadrado } = calcularSumas();

  return (
    <div>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Cuenta</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprobanteContabilidadDetalles.map((detalle, index) => (
            <tr key={index}>
              <td>
                <Form.Select
                  value={detalle.cuenta.codigo ?? ''}
                  onChange={(e) =>
                    handleDetalleChange(index, 'cuentaId', e.target.value)
                  }
                >
                  <option value="">Seleccione una cuenta</option>
                  {cuentas.map((cuenta) => (
                    <option key={cuenta.codigo} value={cuenta.codigo}>
                      {cuenta.nombre}
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={detalle.debe ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^\d*\.?\d{0,2}$/;
                    // Permitir temporalmente el valor vacío para permitir borrar
                    if (value === '' || regex.test(value)) {
                      handleDetalleChange(index, 'debe', value === '' ? '' : Number(value))                      
                    }
                  }}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={detalle.haber ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^\d*\.?\d{0,2}$/;
                    // Permitir temporalmente el valor vacío para permitir borrar
                    if (value === '' || regex.test(value)) {
                      handleDetalleChange(index, 'haber', value === '' ? '' : Number(value))                      
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
                value={detalleNuevo.cuenta.codigo ?? ''}
                onChange={(e) =>
                  handleCuentaAgregarDetalle(e.target.value)
                }
              >
                <option value="">Seleccione una cuenta</option>
                {cuentas.map((cuenta) => (
                  <option key={cuenta.codigo} value={cuenta.codigo}>
                    {cuenta.nombre}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={detalleNuevo.debe ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const regex = /^\d*\.?\d{0,2}$/;
                  // Permitir temporalmente el valor vacío para permitir borrar
                  if (value === '' || regex.test(value)) {
                    setDetalleNuevo({
                      ...detalleNuevo,
                      debe: value === '' ? '' : Number(value),
                    });
                  }
                }}
              />
            </td>
            <td>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              value={detalleNuevo.haber ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^\d*\.?\d{0,2}$/;
                // Permitir temporalmente el valor vacío para permitir borrar
                if (value === '' || regex.test(value)) {
                  setDetalleNuevo({
                    ...detalleNuevo,
                    haber: value === '' ? '' : Number(value),
                  });
                }
              }}
            />
            </td>
            <td className='d-flex justify-content-center'>
              <Button variant="primary" onClick={agregarDetalle}>
                <FontAwesomeIcon icon={faAdd} />
              </Button>
            </td>
          </tr>
          <tr style={{backgroundColor: 'green'}}>
            <td><strong>Total</strong></td>
            <td><strong>{sumaDebe.toFixed(2)}</strong></td>
            <td><strong>{sumaHaber.toFixed(2)}</strong></td>
            <td className='d-flex justify-content-center'>
              {(cuadrado)? (
                <Button variant="success" ref={target} onClick={() => setShowTooltip(!showTooltip)}>
                  <FontAwesomeIcon icon={faCheck} />
                </Button>
              ):(
                <Button variant="danger" ref={target} onClick={() => setShowTooltip(!showTooltip)}>
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              )}
              <Overlay target={target.current} show={showTooltip} placement="left">
                {(props) => (
                  <Tooltip id="overlay-example" {...props}>
                    {cuadrado ? 'Los valores se encuentran cuadrados': 'Los valores NO se encuentran cuadrados'}
                  </Tooltip>
                )}
              </Overlay>
              </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ComprobanteContabilidadDetalle;
