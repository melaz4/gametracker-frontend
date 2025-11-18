import React from 'react'

export default function TarjetaJuego({ nombre, descripcion, imagen, desarrollador }) {
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
				<p className="game-dev">Desarrollador: <strong>{desarrollador}</strong></p>
			</div>
		</article>
	)
}

