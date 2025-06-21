import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Niveles() {
  const [niveles, setNiveles] = useState([]);
  const [palabras, setPalabras] = useState([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/niveles/')
      .then((response) => {
        console.log("Niveles recibidos:", response.data); // 💬 Esto mostrará los datos
        setNiveles(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar niveles:', error);
      });
  }, []);

  const cargarPalabras = (nivelId) => {
    setNivelSeleccionado(nivelId);
    axios.get(`http://127.0.0.1:8000/api/palabras/?nivel=${nivelId}`)
      .then((response) => setPalabras(response.data))
      .catch((error) => console.error('Error al cargar palabras:', error));
  };

  const reproducirPalabra = (texto) => {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-CL'; // Español de Chile
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <h2>Niveles Fonológicos</h2>
      <ul>
        {niveles.map((nivel) => (
          <li key={nivel.id}>
            <button onClick={() => cargarPalabras(nivel.id)}>
              {nivel.nombre}
            </button>
          </li>
        ))}
      </ul>

      {nivelSeleccionado && (
        <>
          <h3>Palabras del nivel seleccionado:</h3>
          <ul>
            {palabras.map((palabra) => (
              <li key={palabra.id}>
                {palabra.texto}
                <button onClick={() => reproducirPalabra(palabra.texto)} style={{ marginLeft: '10px' }}>
                  🔊 Escuchar
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Niveles;
