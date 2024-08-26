import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Attempting login with:', { username, password }); // Log antes de enviar la solicitud

    try {
      const response = await axios.post('http://localhost:8080/login', 
        { username, password }, // Enviar los datos como JSON
        { headers: { 'Content-Type': 'application/json' } } // Encabezado para indicar que el contenido es JSON
      );

      console.log('Login response:', response.data); // Log de la respuesta del servidor

      if (response.data.success) {
        localStorage.setItem('token', 'dummy-token'); // Puedes ajustar el valor del token según sea necesario
        navigate('/dashboard'); // Redirige a la página del dashboard
      } else {
        alert(response.data.message); // Muestra el mensaje de error del backend
      }
    } catch (error) {
      console.error('Error durante el login', error); // Log de cualquier error
      alert('Login fallido. Revisa tus credenciales.'); // Mensaje de error genérico
    }
  };

  const handleOAuth2Login = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-5 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Ingrese su nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
        </form>
        <hr />
        <button onClick={handleOAuth2Login} className="btn btn-secondary w-100 mt-3">
          Iniciar Sesión con Google
        </button>
      </div>
    </div>
  );
};

export default Login;
