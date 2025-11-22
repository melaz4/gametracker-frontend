import React, { useState } from "react";
import StarsRating from "./StarsRating.jsx";

export default function FormularioResena({ juegoId, onSaved }) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [puntuacion, setPuntuacion] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const maxContenido = 800;
  const tituloMax = 80;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!juegoId) return setError("Falta el identificador del juego.");
    if (!puntuacion || puntuacion < 0 || puntuacion > 5) return setError("Puntuación inválida.");
    if (titulo.trim().length === 0) return setError("El título es obligatorio.");
    if (contenido.trim().length === 0) return setError("El contenido de la reseña es obligatorio.");

    setLoading(true);

    try {
      const resp = await fetch("http://localhost:5000/api/resenas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ juegoId, titulo, contenido, puntuacion })
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || "Error al guardar reseña");
        setLoading(false);
        return;
      }

      // exito
      setTitulo("");
      setContenido("");
      setPuntuacion(5);
      if (onSaved) onSaved(data);
    } catch (err) {
      console.error("Error al enviar reseña:", err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-resena">
      <input
        name="titulo"
        placeholder="Título corto (ej. Gran historia)"
        maxLength={tituloMax}
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <div className="row">
        <StarsRating value={puntuacion} editable onChange={(v) => setPuntuacion(v)} />
        <div className="small text-muted">{puntuacion}/5</div>
      </div>

      <textarea
        placeholder="Escribe tu reseña (mínimo 20 caracteres)"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        maxLength={maxContenido}
      />
      <div className="meta">
        <div className="char-count">{contenido.length}/{maxContenido}</div>
        {error && <div className="error small">{error}</div>}
      </div>

      <div className="actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar reseña"}
        </button>
      </div>

      {/* Vista previa */}
      <div className="preview">
        <strong>Vista previa</strong>
        <div className="preview-box">
          <div className="preview-header">
            <div className="preview-title">{titulo || "Sin título"}</div>
            <div className="preview-score"><StarsRating value={puntuacion} editable={false} /></div>
          </div>
          <div className="preview-body small">{contenido || "Tu reseña aparecerá aquí..."}</div>
        </div>
      </div>
    </form>
  );
}
