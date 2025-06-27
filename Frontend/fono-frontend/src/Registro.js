import React, { useState } from 'react';
import axios from 'axios';

function Registro({ onRegistroExitoso }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const registrar = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/registrar/', {
        username,
        password
      });
      setMensaje('Usuario creado exitosamente. Ya puedes iniciar sesión.');
      setUsername('');
      setPassword('');
      onRegistroExitoso(); // opcional: mostrar login
    } catch (error) {
      if (error.response?.data?.error) {
        setMensaje(error.response.data.error);
      } else {
        setMensaje('Error al registrar.');
      }
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={registrar}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Crear cuenta</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Registro;
