import React from "react";

export default function TarjetaJuego({
  _id,
  nombre,
  descripcion,
  genero,
  desarrollador,
  imagen,
  onDelete,
  onEdit,
  onOpenResenas
}) {

  const generos = Array.isArray(genero) ? genero : genero ? [genero] : [];

  return (
    <article className="game-card">
      <div className="game-cover">
        {imagen ? (
          <img src={imagen} alt={nombre} />
        ) : (
          <div className="game-cover--placeholder">Sin imagen</div>
        )}
      </div>

      <div className="game-body">
        <h3 className="game-title">{nombre}</h3>
        <p className="game-desc">{descripcion?.substring(0, 80)}...</p>

        <p className="game-gender">
          <strong>Géneros:</strong> {generos.join(", ")}
        </p>

        <div className="game-actions">
          <button className="btn-edit" onClick={onEdit}>Editar</button>

          <button className="btn-resena-add" onClick={() => onOpenResenas(_id)}>
            Reseñas
          </button>

          <button className="btn-resena-delete" onClick={() => onDelete(_id)}>
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
