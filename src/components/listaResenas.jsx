import React, { useEffect, useState } from "react";

export default function ListaResenas({ juegoId }) {
  const [resenas, setResenas] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function cargar() {
      try {
        const url = juegoId ? `http://localhost:5000/api/resenas?juegoId=${juegoId}` : "http://localhost:5000/api/resenas";
        const resp = await fetch(url, {
          headers: { "Authorization": "Bearer " + token }
        });
        const data = await resp.json();
        setResenas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }
    cargar();
  }, [juegoId]);

  if (resenas.length === 0) return <p className="small">Aún no hay reseñas.</p>;

  return (
    <div>
      {resenas.map(r => (
        <div key={r._id} style={{ padding:8, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <strong>{r.titulo || "Reseña"}</strong>
            <small>{new Date(r.fecha).toLocaleDateString()}</small>
          </div>
          <div className="small">{r.contenido}</div>
          <div className="small">Puntuación: {r.puntuacion} / 5</div>
        </div>
      ))}
    </div>
  )
}
