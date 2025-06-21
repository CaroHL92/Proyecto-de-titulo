import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReporteEstudiante() {
  const [reporte, setReporte] = useState([]);

  // 🔁 PASO 4: Llamar a la API al cargar
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/reporte/1/") // Reemplaza 1 con el ID del estudiante
      .then(res => {
        console.log("📊 Reporte recibido:", res.data);
        setReporte(res.data);
      })
      .catch(err => console.error("Error al obtener el reporte:", err));
  }, []);

  // 📄 PASO 5: Mostrar la tabla
  return (
    <div>
      <h2>Reporte por Estudiante</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Palabra</th>
            <th>Veces practicada</th>
            <th>Última vez</th>
            <th>Duración total (s)</th>
          </tr>
        </thead>
        <tbody>
          {reporte.length > 0 ? (
            reporte.map((r, i) => (
              <tr key={i}>
                <td>{r.palabra__texto}</td>
                <td>{r.veces}</td>
                <td>{new Date(r.ultima).toLocaleDateString()}</td>
                <td>{r.duracion_total.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Sin datos por ahora</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteEstudiante;
