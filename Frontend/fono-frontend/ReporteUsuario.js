import React, { useEffect, useState } from "react";
import axios from "axios";

function ReporteUsuario({ usuario }) {
  const [reporte, setReporte] = useState(null);

  useEffect(() => {
    if (usuario?.id) {
      axios.get(`http://localhost:8000/api/reporte/${usuario.id}/`)
        .then(res => setReporte(res.data))
        .catch(err => console.error("Error al cargar el reporte:", err));
    }
  }, [usuario]);

  if (!usuario?.id) return <p>Debes iniciar sesión para ver tu reporte.</p>;
  if (!reporte) return <p>Cargando reporte...</p>;

  return (
    <div>
      <h2>Reporte de actividad de {usuario.username}</h2>
      <p><strong>Total de práctica:</strong> {reporte.total_duracion.toFixed(2)} segundos</p>
      <p><strong>Grabaciones esta semana:</strong> {reporte.grabaciones_esta_semana}</p>
      <p><strong>Última grabación:</strong> {new Date(reporte.ultima_fecha).toLocaleString()}</p>

      <h3>Grabaciones registradas:</h3>
      <ul>
        {reporte.grabaciones.map((g, index) => (
          <li key={index}>
            {g.palabra_texto || `Palabra ID ${g.palabra}`} - {g.duracion.toFixed(2)} seg -
            <a href={g.archivo_audio} target="_blank" rel="noopener noreferrer"> Escuchar</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReporteUsuario;
