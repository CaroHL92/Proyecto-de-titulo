import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ username, setUsername, password, setPassword, onLoginSuccess, onShowRegister }) {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const iniciarSesion = () => {
    axios.post('http://127.0.0.1:8000/api/token/', { username, password })
      .then(res => {
        const token = res.data.access;
        localStorage.setItem('token', token);
        axios.get('http://127.0.0.1:8000/api/users/me/', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          onLoginSuccess(res.data); 
        });
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          alert("Usuario o contraseña incorrectos.");
        } else {
          alert("Error de conexión con el servidor.");
        }
      });
  };

  const registrar = () => {
    axios.post('http://127.0.0.1:8000/api/register/', { username, password })
      .then(() => {
        alert("Usuario registrado correctamente. Puedes iniciar sesión.");
        setMostrarRegistro(false);
      })
      .catch(err => {
        alert(err.response?.data?.error || "Error al registrar");
      });
  };


  return (
    <div className="login-container">
      <h2>{mostrarRegistro ? "Registrarse" : "Iniciar sesión"}</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {mostrarRegistro ? (
        <>
          <button onClick={registrar}>Crear cuenta</button>
          <p>¿Ya tienes una cuenta? <button onClick={() => setMostrarRegistro(false)}>Iniciar sesión</button></p>
        </>
      ) : (
        <>
          <button onClick={iniciarSesion}>Ingresar</button>
          <p>¿No tienes cuenta? <button onClick={() => setMostrarRegistro(true)}>Registrarse</button></p>
        </> 
      )}
    </div>
  );
}


export default Login;
