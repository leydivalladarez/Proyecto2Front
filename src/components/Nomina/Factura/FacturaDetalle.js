import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';

const FacturaDetalle = ({ facturaDetalles = [], setFacturaDetalles }) => {
  const [articulos, setArticulos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [detalleNuevo, setDetalleNuevo] = useState({
    articulo: {codigo : ''},
    cantidad: 1,
    precio: '',
    precioTotal: '',
  });

  useEffect(() => {
    // Cargar la lista de artículos
    axios
      .get('http://localhost:8080/api/v1/articulos')
      .then((response) => {
        setArticulos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const agregarDetalle = () => {
    console.table(detalleNuevo);
    // return;
    if (!detalleNuevo.articulo.codigo || !detalleNuevo.precio) {
      return;
    }

    setFacturaDetalles([...facturaDetalles, { ...detalleNuevo }]);
    setDetalleNuevo({
      articulo: {codigo : ''},
      cantidad: 1,
      precio: '',
      precioTotal: '',
    });
  };

  const handleArticuloAgregarDetalle = (valor) => {
    const articulo = articulos.find((a) => a.codigo.toString() === valor);
    if(articulo){
        setDetalleNuevo({
            ...detalleNuevo,
            articulo: {codigo : valor},
            cantidad: detalleNuevo.cantidad,
            precio: articulo.precio,
            precioTotal: detalleNuevo.cantidad ? articulo.precio * detalleNuevo.cantidad:'' ,
        });
    }    
  }

  const handleDetalleChange = (index, campo, valor) => {
    const nuevosDetalles = [...facturaDetalles];

    if (campo === 'articuloId') {
      const articulo = articulos.find((a) => a.codigo.toString() === valor);
      if (articulo) {
        nuevosDetalles[index].articulo = articulo;
        nuevosDetalles[index].precio = articulo.precio;
        nuevosDetalles[index].precioTotal = articulo.precio * nuevosDetalles[index].cantidad;
      } else {
        nuevosDetalles[index].precio = '';
        nuevosDetalles[index].precioTotal = '';
      }
    } else {
      nuevosDetalles[index][campo] = valor;

      if (campo === 'cantidad' || campo === 'precio') {
        nuevosDetalles[index].precioTotal =
          nuevosDetalles[index].cantidad * nuevosDetalles[index].precio;
      }
    }

    setFacturaDetalles(nuevosDetalles);
    calcularTotales();
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = facturaDetalles.filter((_, i) => i !== index);
    setFacturaDetalles(nuevosDetalles);
  };

  const calcularTotales = () => {
    const stotal = facturaDetalles.reduce((acc, detalle) => acc + detalle.precio * detalle.cantidad
    , 0);
    setSubtotal(stotal);
  }

  return (
    <div>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Precio Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturaDetalles.map((detalle, index) => (
            <tr key={index}>
              <td>
                <Form.Select
                  value={detalle.articulo.codigo}
                  onChange={(e) =>
                    handleDetalleChange(index, 'articuloId', e.target.value)
                  }
                >
                  <option value="">Seleccione un artículo</option>
                  {articulos.map((articulo) => (
                    <option key={articulo.codigo} value={articulo.codigo}>
                      {articulo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="number"
                  min="1"
                  value={detalle.cantidad}
                  onChange={(e) =>
                    handleDetalleChange(index, 'cantidad', Number(e.target.value))
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={detalle.precio ? detalle.precio.toFixed(2): ''}
                  onChange={(e) =>
                    handleDetalleChange(index, 'precio', Number(e.target.value))
                  }
                />
              </td>
              <td>
                <Form.Control
                  className='text-end'
                  type="number"
                  step="0.01"
                  value={detalle.precioTotal ? detalle.precioTotal.toFixed(2) : ''}
                  readOnly
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
                value={detalleNuevo.articulo.codigo}
                onChange={(e) =>
                  handleArticuloAgregarDetalle(e.target.value)
                }
              >
                <option value="">Seleccione un artículo</option>
                {articulos.map((articulo) => (
                  <option key={articulo.codigo} value={articulo.codigo}>
                    {articulo.nombre}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <Form.Control
                type="number"
                min="1"
                value={detalleNuevo.cantidad}
                onChange={(e) =>
                  setDetalleNuevo({
                    ...detalleNuevo,
                    cantidad: Number(e.target.value),
                  })
                }
              />
            </td>
            <td>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={detalleNuevo.precio ? detalleNuevo.precio.toFixed(2) : ''}
                onChange={(e) =>
                  setDetalleNuevo({
                    ...detalleNuevo,
                    precio: Number(e.target.value),
                  })
                }
              />
            </td>
            <td>
              <Form.Control
                className='text-end'
                type="number"
                step="0.01"
                value={(detalleNuevo.precioTotal = detalleNuevo.cantidad * detalleNuevo.precio).toFixed(2)}
                readOnly
              />
            </td>
            <td className='d-flex justify-content-center'>
              <Button variant="primary" onClick={agregarDetalle}>
                <FontAwesomeIcon icon={faAdd} />
              </Button>
            </td>
          </tr>
          <tr>
            <td colSpan={2}></td>
            <td className='text-end'>Total</td>
            <td className='text-end'>{subtotal ? subtotal.toFixed(2) : ''}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default FacturaDetalle;
