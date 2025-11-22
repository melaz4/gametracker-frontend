import React, { useState, useEffect } from "react";
import FormularioResena from "./FormularioResena";

export default function ModalResenas({ juegoId, onClose }) {
  const [resenas, setResenas] = useState([]);
  const token = localStorage.getItem("token");

  async function cargar() {
    try {
      const resp = await fetch(
        `http://localhost:5000/api/resenas?juegoId=${juegoId}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      const data = await resp.json();
      setResenas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close" onClick={onClose}>✕</button>

        <h3>Reseñas</h3>

        <FormularioResena
          juegoId={juegoId}
          onSaved={cargar}
        />

        <hr style={{ margin: "16px 0" }} />

        {resenas.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No hay reseñas aún.</p>
        ) : (
          resenas.map((r) => (
            <div key={r._id} className="resena-box">
              <h4>{r.titulo}</h4>
              <p>{r.contenido}</p>
              <small>Puntuación: {r.puntuacion} / 5</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
