import React, { useState, useEffect } from "react";
import { ReactMic } from 'react-mic';
import axios from 'axios';

function Grabador(props) {
  const [grabando, setGrabando] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [audioDuracion, setAudioDuracion] = useState(null);
  const [palabras, setPalabras] = useState([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [palabraSeleccionada, setPalabraSeleccionada] = useState(null);
  const [niveles, setNiveles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/niveles/")
      .then(res => setNiveles(res.data))
      .catch(err => console.error("Error cargando niveles", err));
  }, []);

  useEffect(() => {
    if (nivelSeleccionado) {
      console.log("Nivel seleccionado:", nivelSeleccionado);
      axios.get(`http://localhost:8000/api/palabras/?nivel=${nivelSeleccionado}`)
        .then(res => {
          setPalabras(res.data);
          setPalabraSeleccionada("");
        })
        .catch(err => console.error("❌ Error cargando palabras:", err));
    }
  }, [nivelSeleccionado]);

  const reproducirPalabra = (texto) => {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-CL';
    window.speechSynthesis.speak(utterance);
  };

  const iniciarGrabacion = () => {
    setStartTime(Date.now());
    setAudioBlob(null);
    setGrabando(true);
  }
  
  const detenerGrabacion = () => {
  if (!startTime) {
    console.warn("⚠️ inicioGrabacion está vacío, duración no podrá calcularse.");
    alert("No se pudo calcular la duración del audio. Intenta nuevamente.");
    return;
  }
  const duracion = (Date.now() - startTime) / 1000;
  setAudioDuracion(duracion);
  console.log("⏱️ Duración calculada:", duracion);
  setGrabando(false);
};



  const handleEnviar = () => {
    if (audioDuracion === null) {
      alert("No se pudo calcular la duración del audio. Intenta nuevamente.");
      return;
    }
    enviarGrabacion();
  };

  const enviarGrabacion = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('archivo_audio', audioBlob, 'grabacion.webm');
    formData.append('palabra', palabraSeleccionada);  

    const duracionFinal = parseFloat(audioDuracion);
    formData.append('duracion', isFinite(duracionFinal) ? duracionFinal : 0);
    formData.append('usuario', props.usuario.id);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/grabaciones/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Grabación enviada:', response.data);
      alert('Grabación guardada exitosamente');
    } catch (error) {
      if (error.response) {
        console.error('❌ Error del backend:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('❌ Error inesperado:', error);
      }
      alert('Error al guardar la grabación');
    }
  };

  const reproducirAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    }
  };

  const cuandoTermina = (recordedBlob) => {
    setAudioBlob(recordedBlob.blob);

    const audioURL = URL.createObjectURL(recordedBlob.blob);
    const audio = new Audio(audioURL);
    audio.src = audioURL;

    if (startTime) {
      const ahora = Date.now();
      const duracionSegundos = ((ahora - startTime) / 1000).toFixed(2);
      setAudioDuracion(parseFloat(duracionSegundos));
      console.log("⏱️ Duración calculada manualmente:", duracionSegundos);
    } else {
      console.warn("⚠️ inicioGrabacion está vacío, duración no pudo calcularse.");
    }
  };

  return (
    <div>
      <div>
        <label>Selecciona un nivel:</label>
        <select onChange={(e) => setNivelSeleccionado(Number(e.target.value))}>
          <option value="">-- Nivel --</option>
          {niveles.map(nivel => (
            <option key={nivel.id} value={nivel.id}>
              {nivel.nombre}
            </option>
          ))}
        </select>
      </div>

      {nivelSeleccionado && (
        <div>
          <label>Selecciona una palabra:</label>
          <select onChange={(e) => setPalabraSeleccionada(Number(e.target.value))}>
            <option value="">-- Palabra --</option>
            {palabras.map((palabra) => (
              <option key={palabra.id} value={palabra.id}>{palabra.texto}</option>
            ))}
          </select>
        </div>
      )}

      <h3>Graba tu voz</h3>
      <ReactMic
        record={grabando}
        onStop={cuandoTermina}
        onStart={() => {
          console.log("🎙️ Grabación iniciada");
          setStartTime(Date.now());
        }}
        mimeType="audio/webm"
        strokeColor="#000"
        backgroundColor="#eee"
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => {
          const palabra = palabras.find(p => p.id === palabraSeleccionada);
          if (palabra) {
            reproducirPalabra(palabra.texto);
          }
        }}>
        🔊 Escuchar palabra modelo</button>
        <button onClick={iniciarGrabacion}>🎙️ Grabar</button>
        <button onClick={detenerGrabacion}>⏹️ Detener</button>
        <button onClick={reproducirAudio} disabled={!audioBlob}>▶️ Escuchar</button>
        <button onClick={handleEnviar} disabled={!audioBlob}>📤 Enviar</button>
      </div>
    </div>
  );
}

export default Grabador;
