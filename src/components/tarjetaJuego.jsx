import React from 'react';

export default function TarjetaJuego({
  _id,
  nombre,
  genero,
  descripcion,
  imagen,
  desarrollador,
  onDelete
}) {
  return (
    <article className="game-card">
      <div className="game-cover">
        {imagen ? (
          <img src={imagen} alt={`${nombre} cover`} />
        ) : (
          <div className="game-cover--placeholder">No Image</div>
        )}
      </div>

      <div className="game-body">
        <h3 className="game-title">{nombre}</h3>
        <p className="game-desc">{descripcion}</p>
        <p className="game-gender">{genero}</p>
        <p className="game-dev">Desarrollador: <strong>{desarrollador}</strong></p>

        <button
          className="btn-delete"
          onClick={() => onDelete(_id)} // ← PASAR UNA FUNCIÓN, NO INVOCAR
          style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}