import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Grabador from './Grabador';
import ReporteEstudiante from './ReporteEstudiante';
import { NavLink } from 'react-router-dom';
import Login from './Login';

function App() {
  const [usuario, setUsuario] = useState(null);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  if (!usuario) {
    return <Login onLoginSuccess={setUsuario} />;
  }

  return (
    <Router>
      <div className="App">
        {/* 🧠 Encabezado con usuario y logout */}
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
          <Route path="/reporte" element={<ReporteEstudiante usuario={usuario} />} />
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
