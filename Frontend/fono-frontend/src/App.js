import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Grabador from './Grabador';
import { NavLink } from 'react-router-dom';
import Registro from './Registro';
import Login from './Login';
import ReporteUsuario from './ReporteUsuario';
import { Navigate } from 'react-router-dom';


function App() {
  const [usuario, setUsuario] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    const tipo = localStorage.getItem('tipo_usuario');
    if (tipo) {
      setTipoUsuario(tipo);
    }
  }, []);


    useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !usuario) {
      axios.get('http://127.0.0.1:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUsuario(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUsuario(null);
      });
    }
  }, [usuario]);


  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  if (!usuario) {
    return mostrarRegistro ? (
    <Registro
      onLoginSuccess={setUsuario}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      volver={() => setMostrarRegistro(false)}
    />
  ) : (
    <div style={{ padding: '20px' }}>
      <Login
        onLoginSuccess={setUsuario}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onShowRegister={() => {
          setUsername('');
          setPassword('');
          setMostrarRegistro(true);
        }}
      />
    </div>
  );
}

  return (
    <Router>
      <div className="App">
        {/* Encabezado con usuario y logout */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#f5f5f5',
          borderBottom: '2px solid #ccc'
        }}>
          <h1>HablaFácil</h1>
          <div style={{ fontSize: '14px', fontStyle: 'italic' }}>
            👤 {usuario.username} &nbsp;
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </div>
        </header>

        { /* Barra de navegación */}
      
        <nav className="navbar">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>🏠 Inicio</NavLink>
          <NavLink to="/ejercicios" className={({ isActive }) => isActive ? "active" : ""}>🗣️ Ejercicios</NavLink>
          <NavLink to="/reporte" className={({ isActive }) => isActive ? "active" : ""}>📊 Reporte</NavLink>
        </nav>
    

        {/* 📦 Rutas de contenido */}
        <Routes>
          <Route path="/" element={<Inicio usuario={usuario} />} />
          <Route path="/ejercicios" element={<Grabador usuario={usuario} />} />
          <Route path="/reporte" element={usuario ? <ReporteUsuario usuario={usuario} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

// 🧠 Componente de bienvenida
function Inicio({ usuario }) {
  return (
    <div>
      <h2>Bienvenido a HablaFácil</h2>
      <p>👤 {usuario.username}</p>
      <p>Selecciona una sección desde el menú para comenzar.</p>
    </div>
  );
}

export default App;
