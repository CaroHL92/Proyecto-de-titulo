import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SelectorNivel({ onSeleccionarPalabra }) {
  const [niveles, setNiveles] = useState([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [palabras, setPalabras] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/niveles/')
      .then(res => setNiveles(res.data))
      .catch(err => console.error("Error cargando niveles", err));
  }, []);

  useEffect(() => {
    if (nivelSeleccionado) {
      axios.get(`http://127.0.0.1:8000/api/palabras/?nivel=${nivelSeleccionado}`)
        .then(res => setPalabras(res.data))
        .catch(err => console.error("Error cargando palabras", err));
    } else {
      setPalabras([]);
    }
  }, [nivelSeleccionado]);

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Selecciona un nivel</h3>
      <select onChange={e => setNivelSeleccionado(e.target.value)} value={nivelSeleccionado || ''}>
        <option value="">-- Elige un fonema --</option>
        {niveles.map(n => (
          <option key={n.id} value={n.id}>{n.nombre}</option>
        ))}
      </select>

      {palabras.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Palabras:</h4>
          <ul>
            {palabras.map(p => (
              <li key={p.id}>
                <button onClick={() => onSeleccionarPalabra(p)}>{p.texto}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SelectorNivel;
