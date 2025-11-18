import React, { useState } from 'react'
import TarjetaJuego from '../components/tarjetaJuego'

export default function BibliotecaJuegos() {
	const [games, setGames] = useState([])
	const [form, setForm] = useState({ nombre: '', descripcion: '', desarrollador: '', imagen: '' })

	function handleChange(e) {
		const { name, value } = e.target
		setForm((s) => ({ ...s, [name]: value }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		if (!form.nombre.trim()) return alert('El nombre es obligatorio')

		const newGame = {
			id: Date.now(),
			nombre: form.nombre.trim(),
			descripcion: form.descripcion.trim(),
			desarrollador: form.desarrollador.trim() || 'Desconocido',
			imagen: form.imagen.trim() || '',
		}

		setGames((g) => [newGame, ...g])
		setForm({ nombre: '', descripcion: '', desarrollador: '', imagen: '' })
	}

	return (
		<section>
			<h2>Biblioteca de Juegos</h2>

			<form className="game-form" onSubmit={handleSubmit} style={{ marginBottom: 18 }}>
				<div className="row">
					<input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
					<input name="desarrollador" placeholder="Desarrollador" value={form.desarrollador} onChange={handleChange} />
				</div>
				<div className="row">
					<input name="imagen" placeholder="URL de imagen (opcional)" value={form.imagen} onChange={handleChange} />
				</div>
				<div className="row">
					<textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
				</div>
				<div>
					<button type="submit">Añadir juego</button>
				</div>
			</form>

			{games.length === 0 ? (
				<p>No hay juegos todavía. Usa el formulario para añadir uno.</p>
			) : (
				<div className="games-grid">
					{games.map((g) => (
						<TarjetaJuego key={g.id} nombre={g.nombre} descripcion={g.descripcion} desarrollador={g.desarrollador} imagen={g.imagen} />
					))}
				</div>
			)}
		</section>
	)
}


