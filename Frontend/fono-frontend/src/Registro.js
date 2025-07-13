import React, { useState } from 'react';
import axios from 'axios';

function Registro({ onRegistroExitoso }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState(''); 


  const registrar = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/registrar/', {
        username,
        password,
        tipo
      });
      
      
      if (res.status === 201) {
        setMensaje('Usuario creado exitosamente. Ya puedes iniciar sesión.');
        setUsername('');
        setPassword('');
        onRegistroExitoso();
      } else {
        setMensaje('Respuesta inesperada del servidor.');
        console.warn('Respuesta inesperada:', res);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      if (error.response?.data?.error) {
        setMensaje(error.response.data.error);
      } else {
        setMensaje('Error al registrar.');
      }
    }
  };

  return (
    <><div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Registrarse</h2>
        <form onSubmit={registrar}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)} /><br />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)} /><br />
          <label htmlFor="tipo">Tipo de usuario:</label>
          <select id="tipo" value={tipo} onChange={(e) => {
            setTipo(e.target.value);
            console.log('Tipo seleccionado:', e.target.value);
          }}
          style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
          >
            <option value="">-- Selecciona un tipo --</option>
            <option value="nino">Niño/Adolescente</option>
            <option value="fonoaudiologo">Fonoaudiólogo</option>
          </select>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button type="submit">
              Crear cuenta
            </button>
          </div>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div></>
  );
}

export default Registro;
